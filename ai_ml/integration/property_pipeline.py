"""
End-to-End Integrated Property Mapping Pipeline (`property_pipeline.py`).
Orchestrates:
Point Cloud -> Spatial Tiler -> Frozen PointNet2 ML -> Frozen HDBSCAN -> Quality Filter ->
3D Geometry -> Roof Height -> Floor Inference -> Multi-Indicator Confidence -> Property Hierarchy ->
ULPIN Candidate Record -> JSON/GeoJSON/CSV Exporters.
"""

import sys
import os
import torch
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.property.provenance import PipelineProvenance
from ai_ml.property.instance_filter import InstanceQualityFilter
from ai_ml.property.geometry_extractor import BuildingGeometryExtractor
from ai_ml.property.roof_height_pipeline import RoofHeightPipeline
from ai_ml.property.floor_pipeline import FloorPipeline
from ai_ml.property.confidence import MultiIndicatorConfidence
from ai_ml.property.parcel_association import ParcelAssociation
from ai_ml.property.property_hierarchy import PropertyHierarchyBuilder
from ai_ml.property.ulpin_candidate import ULPINCandidateRecord
from ai_ml.export.json_exporter import JSONExporter
from ai_ml.export.geojson_exporter import GeoJSONExporter
from ai_ml.export.csv_exporter import CSVExporter
from ai_ml.integration.crs_manager import CRSManager
from ai_ml.integration.cross_tile_reconciler import CrossTileInstanceReconciler

class EndToEndPropertyPipeline:
    def __init__(self, device: str = "cpu", source_crs: str = "EPSG:2193"):
        self.device = torch.device(device)
        self.crs_mgr = CRSManager(source_crs=source_crs)
        self.quality_filter = InstanceQualityFilter()
        self.roof_pipeline = RoofHeightPipeline()
        self.floor_pipeline = FloorPipeline()

        # Load Frozen Neural Model
        self.model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(self.device)
        ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"
        if ckpt_path.exists():
            ckpt = torch.load(ckpt_path, map_location=self.device)
            self.model.load_state_dict(ckpt["model_state_dict"])
        self.model.eval()

        # Load Frozen Production Decoder
        self.decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5, alpha_spatial=1.0, beta_embedding=0.5)

    def process_scene(
        self,
        pts_xyz: np.ndarray,
        intensity: Optional[np.ndarray] = None,
        scene_id: str = "SCENE_001",
        authoritative_parcels: Optional[list] = None
    ) -> Dict[str, Any]:
        provenance = PipelineProvenance.get_provenance(dataset_name=scene_id, source_crs=self.crs_mgr.source_crs)

        if len(pts_xyz) == 0:
            hierarchy = PropertyHierarchyBuilder.build_hierarchy(scene_id, [], authoritative_parcels, provenance, self.crs_mgr.source_crs)
            ulpin_rec = ULPINCandidateRecord.create_candidate_record(f"ULPIN_CANDIDATE_{scene_id}", [], f"PROPERTY_CANDIDATE_{scene_id}", None, provenance, self.crs_mgr.source_crs)
            return {"hierarchy": hierarchy, "ulpin_record": ulpin_rec}

        if intensity is None:
            intensity = np.zeros(len(pts_xyz))

        # CRS Coordinate Normalization
        norm_pts, norm_params = self.crs_mgr.normalize_coordinates(pts_xyz)
        feats_4d = np.column_stack([norm_pts[:, 0], norm_pts[:, 1], norm_pts[:, 2], intensity])

        # Subsample to 4096 points if needed for PointNet++ input
        N_raw = len(pts_xyz)
        num_points = min(4096, N_raw)
        choice = np.random.choice(N_raw, num_points, replace=(N_raw < num_points))

        sub_pts = pts_xyz[choice]
        sub_feats = feats_4d[choice]

        pos_t = torch.tensor(sub_pts, dtype=torch.float32).unsqueeze(0).to(self.device)
        feats_t = torch.tensor(sub_feats, dtype=torch.float32).unsqueeze(0).to(self.device)

        with torch.no_grad():
            out = self.model(pos_t, feats_t)
            sem_probs = torch.softmax(out["semantic_logits"], dim=1)[0, 1].cpu().numpy()
            off_pred = out["offset_pred"][0].transpose(0, 1).cpu().numpy()
            emb_pred = out["embedding_pred"][0].transpose(0, 1).cpu().numpy()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        # Frozen Production Decoding
        pred_inst, dec_meta = self.decoder.decode_instances(sub_pts, sem_probs, off_pred, emb_pred)

        unique_insts = np.unique(pred_inst[pred_inst > 0])
        tile_candidates = []

        ground_z = float(np.percentile(sub_pts[:, 2], 5))

        for idx, inst_id in enumerate(unique_insts, start=1):
            mask = (pred_inst == inst_id)
            inst_pts = sub_pts[mask]
            inst_probs = sem_probs[mask]

            geom = BuildingGeometryExtractor.extract_geometry(inst_pts)
            roof = self.roof_pipeline.process_roof_height(inst_pts, ground_z_m=ground_z)
            floors = self.floor_pipeline.process_floors(inst_pts, roof["height_m"], ground_z_m=ground_z)
            conf = MultiIndicatorConfidence.calculate_indicators(
                float(np.mean(inst_probs)), len(inst_pts), geom["point_density_pts_sqm"],
                geom["footprint_status"], roof["height_quality"], floors["candidate_floor_count"]
            )

            status, rejections = self.quality_filter.assess_candidate(
                len(inst_pts), geom["footprint_area_sqm"], roof["height_m"],
                geom["point_density_pts_sqm"], float(np.mean(inst_probs))
            )

            cand = {
                "candidate_instance_id": f"CANDIDATE_B_{idx:03d}",
                "source_scene_id": scene_id,
                "source_tiles": ["TILE_001"],
                "point_count": len(inst_pts),
                "status": status,
                "rejection_reasons": rejections,
                "geometry": geom,
                "height": roof,
                "floors": floors,
                "confidence": conf,
                "is_legal_boundary": False,
                "requires_surveyor_validation": True,
                "requires_cadastral_authority_validation": True
            }
            tile_candidates.append(cand)

        # Cross-Tile Reconciliation
        reconciled_bldgs = CrossTileInstanceReconciler.reconcile_instances(tile_candidates)

        # Parcel Association (Optional)
        parcel_assoc = ParcelAssociation.associate_building([], authoritative_parcels)

        # Hierarchy & ULPIN Candidate Record
        hierarchy = PropertyHierarchyBuilder.build_hierarchy(scene_id, reconciled_bldgs, authoritative_parcels, provenance, self.crs_mgr.source_crs)
        ulpin_rec = ULPINCandidateRecord.create_candidate_record(f"ULPIN_CANDIDATE_{scene_id}", reconciled_bldgs, f"PROPERTY_CANDIDATE_{scene_id}", parcel_assoc, provenance, self.crs_mgr.source_crs)

        return {
            "hierarchy": hierarchy,
            "ulpin_record": ulpin_rec
        }
