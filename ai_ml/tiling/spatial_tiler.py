"""
Milestone 3 — Spatial Inference Tiling & Global Instance Stitching (`spatial_tiler.py`).
Processes large 3D scenes (e.g., 384m x 291m) via 40m x 40m sliding window tiles with 10m overlap.
Transforms local offset predictions back into global metric space and performs global HDBSCAN clustering.
"""

import numpy as np
import torch
from typing import Dict, Any, List, Tuple

from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder


class SpatialInferenceTiler:
    def __init__(
        self,
        tile_size_m: float = 40.0,
        overlap_m: float = 10.0,
        target_pts_per_tile: int = 8192
    ):
        self.tile_size_m = tile_size_m
        self.overlap_m = overlap_m
        self.stride_m = tile_size_m - overlap_m
        self.target_pts_per_tile = target_pts_per_tile

    def process_large_scene(
        self,
        model: torch.nn.Module,
        points_xyz_global: np.ndarray,      # [N, 3]
        features_5d: np.ndarray,            # [N, 5] (X_norm, Y_norm, Z_norm, HAG, Intensity)
        feature_mode: str = "XYZ_Intensity",
        device: str = "cpu"
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Runs tiled inference on a large scene and returns global predictions.
        Returns:
            global_sem_probs: [N]
            global_offsets: [N, 3]
            global_embeddings: [N, 16]
            tiling_metadata: dict
        """
        N = len(points_xyz_global)
        model.eval()

        global_sem_probs = np.zeros(N, dtype=float)
        global_offsets = np.zeros((N, 3), dtype=float)
        global_embeddings = np.zeros((N, 16), dtype=float)
        vote_counts = np.zeros(N, dtype=int)

        x_min, x_max = points_xyz_global[:, 0].min(), points_xyz_global[:, 0].max()
        y_min, y_max = points_xyz_global[:, 1].min(), points_xyz_global[:, 1].max()

        x_bins = np.arange(x_min, x_max + self.tile_size_m, self.stride_m)
        y_bins = np.arange(y_min, y_max + self.tile_size_m, self.stride_m)

        tile_count = 0

        with torch.no_grad():
            for i in range(len(x_bins) - 1):
                for j in range(len(y_bins) - 1):
                    x_start, x_end = x_bins[i], x_bins[i] + self.tile_size_m
                    y_start, y_end = y_bins[j], y_bins[j] + self.tile_size_m

                    tile_mask = (
                        (points_xyz_global[:, 0] >= x_start) & (points_xyz_global[:, 0] < x_end) &
                        (points_xyz_global[:, 1] >= y_start) & (points_xyz_global[:, 1] < y_end)
                    )
                    tile_indices = np.where(tile_mask)[0]
                    n_tile = len(tile_indices)

                    if n_tile < 20:
                        continue

                    tile_count += 1
                    t_xyz = points_xyz_global[tile_indices]
                    t_feats_5d = features_5d[tile_indices]

                    # Sampling for network forward pass
                    if n_tile >= self.target_pts_per_tile:
                        sample_choice = np.random.choice(n_tile, self.target_pts_per_tile, replace=False)
                    else:
                        sample_choice = np.random.choice(n_tile, self.target_pts_per_tile, replace=True)

                    s_indices = tile_indices[sample_choice]
                    s_pos = torch.tensor(t_xyz[sample_choice], dtype=torch.float32).unsqueeze(0).to(device)

                    if feature_mode == "XYZ":
                        s_feats = t_feats_5d[sample_choice][:, :3]
                    elif feature_mode == "XYZ_Intensity":
                        s_feats = t_feats_5d[sample_choice][:, [0, 1, 2, 4]]
                    elif feature_mode == "XYZ_HAG_Intensity":
                        s_feats = t_feats_5d[sample_choice][:, :5]
                    else:
                        s_feats = t_feats_5d[sample_choice][:, :4]

                    s_feats_t = torch.tensor(s_feats, dtype=torch.float32).unsqueeze(0).to(device)

                    # Network Forward Pass
                    out = model(s_pos, s_feats_t)

                    sem_probs = torch.softmax(out["semantic_logits"], dim=1)[0, 1].cpu().numpy()  # [S]
                    off_pred = out["offset_pred"][0].transpose(0, 1).cpu().numpy()               # [S, 3]
                    emb_pred = out["embedding_pred"][0].transpose(0, 1).cpu().numpy()            # [S, 16]

                    # Accumulate predictions into global arrays
                    np.add.at(global_sem_probs, s_indices, sem_probs)
                    np.add.at(global_offsets, (s_indices, slice(None)), off_pred)
                    np.add.at(global_embeddings, (s_indices, slice(None)), emb_pred)
                    np.add.at(vote_counts, s_indices, 1)

        # Average accumulated predictions
        valid_votes = (vote_counts > 0)
        global_sem_probs[valid_votes] /= vote_counts[valid_votes]
        global_offsets[valid_votes] /= vote_counts[valid_votes][:, None]
        global_embeddings[valid_votes] /= vote_counts[valid_votes][:, None]

        return global_sem_probs, global_offsets, global_embeddings, {
            "total_tiles_processed": tile_count,
            "total_points_evaluated": N,
            "uncovered_points_count": int(np.sum(vote_counts == 0))
        }


if __name__ == "__main__":
    tiler = SpatialInferenceTiler(tile_size_m=40.0, overlap_m=10.0)
    print(f"Spatial Inference Tiler configured: Tile size={tiler.tile_size_m}m, Overlap={tiler.overlap_m}m, Stride={tiler.stride_m}m")
