"""
Milestone 3 — HDBSCAN Instance Decoder Module (`instance_decoder.py`).
Decodes per-point building instance IDs by applying HDBSCAN clustering (via sklearn.cluster.HDBSCAN) in
joint shifted centroid and embedding feature space: F_i = [alpha * (P + dP), beta * e_i].
Remaps predicted building clusters to contiguous instance IDs (1..N) and background to 0.
"""

import warnings
warnings.filterwarnings("ignore")

import numpy as np
try:
    from sklearn.cluster import HDBSCAN
except ImportError:
    from sklearn.cluster import DBSCAN as HDBSCAN  # Fallback
from typing import Dict, Any, Tuple


class HDBSCANInstanceDecoder:
    def __init__(
        self,
        semantic_threshold: float = 0.50,
        min_cluster_size: int = 20,
        min_samples: int = 5,
        cluster_selection_method: str = "eom",
        alpha_spatial: float = 1.0,
        beta_embedding: float = 0.5
    ):
        self.semantic_threshold = semantic_threshold
        self.min_cluster_size = min_cluster_size
        self.min_samples = min_samples
        self.cluster_selection_method = cluster_selection_method
        self.alpha_spatial = alpha_spatial
        self.beta_embedding = beta_embedding

    def decode_instances(
        self,
        points_xyz: np.ndarray,          # [N, 3]
        semantic_probs: np.ndarray,       # [N] (Building probability)
        offset_pred: np.ndarray,         # [N, 3]
        embedding_pred: np.ndarray       # [N, 16]
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Decodes building instance IDs for a single scene.
        Returns:
            predicted_instance_ids: [N] (0=BG, 1..K=Building Instances)
            decoding_metadata: dict
        """
        N = len(points_xyz)
        predicted_instance_ids = np.zeros(N, dtype=int)

        # 1. Select Building Points via Semantic Threshold
        building_mask = (semantic_probs >= self.semantic_threshold)
        n_bldg = int(np.sum(building_mask))

        if n_bldg < self.min_cluster_size:
            return predicted_instance_ids, {
                "num_building_points": n_bldg,
                "predicted_instance_count": 0,
                "status": "INSENSITIVE_POINTS"
            }

        # 2. Compute Shifted Centroid Coordinates: P' = P + dP
        bldg_pts = points_xyz[building_mask]
        bldg_offsets = offset_pred[building_mask]
        bldg_emb = embedding_pred[building_mask]

        shifted_pts = bldg_pts + bldg_offsets  # [n_bldg, 3]

        # 3. Construct Joint Feature Space: [alpha * P', beta * e]
        scaled_spatial = self.alpha_spatial * shifted_pts
        scaled_emb = self.beta_embedding * bldg_emb
        joint_features = np.hstack([scaled_spatial, scaled_emb])  # [n_bldg, 19]

        # 4. HDBSCAN Clustering via sklearn
        clusterer = HDBSCAN(
            min_cluster_size=self.min_cluster_size,
            min_samples=self.min_samples,
            cluster_selection_method=self.cluster_selection_method,
            metric='euclidean'
        )
        raw_labels = clusterer.fit_predict(joint_features)

        # 5. Remap Labels to Contiguous 1..K (Ignore noise -1)
        unique_labels = np.unique(raw_labels)
        unique_labels = unique_labels[unique_labels != -1]

        mapped_bldg_inst = np.zeros(n_bldg, dtype=int)
        for new_id, old_label in enumerate(unique_labels, start=1):
            mapped_bldg_inst[raw_labels == old_label] = new_id

        predicted_instance_ids[building_mask] = mapped_bldg_inst

        return predicted_instance_ids, {
            "num_building_points": n_bldg,
            "predicted_instance_count": len(unique_labels),
            "hdbscan_noise_points": int(np.sum(raw_labels == -1))
        }


if __name__ == "__main__":
    decoder = HDBSCANInstanceDecoder(min_cluster_size=10, min_samples=3)
    dummy_xyz = np.random.uniform(0, 50, (500, 3))
    dummy_probs = np.random.uniform(0, 1, 500)
    dummy_offsets = np.random.normal(0, 0.5, (500, 3))
    dummy_emb = np.random.normal(0, 1, (500, 16))

    inst_ids, meta = decoder.decode_instances(dummy_xyz, dummy_probs, dummy_offsets, dummy_emb)
    print("Decoder Test Output:")
    print("  Unique Instance IDs:", np.unique(inst_ids))
    print("  Metadata:", meta)
