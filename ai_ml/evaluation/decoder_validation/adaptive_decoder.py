"""
Experiment G — Deterministic Density-Aware Adaptive Decoder (`adaptive_decoder.py`).
Estimates local/global point density from input point cloud and dynamically maps to
optimal HDBSCAN parameters (min_cluster_size, min_samples, alpha, beta).
Zero GT leakage during inference.
Saves adaptive_decoder_results.json.
"""

import numpy as np
from typing import Dict, Any, Tuple
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.decoder_validation.density_analysis import DensityAnalyzer

class AdaptiveDensityDecoder:
    def __init__(self, semantic_threshold: float = 0.50):
        self.semantic_threshold = semantic_threshold

    def _select_parameters(self, global_density: float) -> Tuple[int, int, float, float]:
        if global_density >= 2.0:
            return 20, 5, 1.0, 0.5
        elif global_density >= 0.75:
            return 10, 3, 1.0, 0.5
        else:
            return 5, 1, 1.0, 0.5

    def decode_instances(
        self,
        points_xyz: np.ndarray,
        semantic_probs: np.ndarray,
        offset_pred: np.ndarray,
        embedding_pred: np.ndarray
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        d_stats = DensityAnalyzer.calculate_density_stats(points_xyz, cell_size_m=2.0)
        g_density = d_stats["global_density"]

        m_cs, m_s, alpha, beta = self._select_parameters(g_density)

        decoder = HDBSCANInstanceDecoder(
            semantic_threshold=self.semantic_threshold,
            min_cluster_size=m_cs,
            min_samples=m_s,
            alpha_spatial=alpha,
            beta_embedding=beta
        )

        pred_inst, meta = decoder.decode_instances(points_xyz, semantic_probs, offset_pred, embedding_pred)
        meta["adaptive_selected_params"] = {
            "global_density": g_density,
            "min_cluster_size": m_cs,
            "min_samples": m_s,
            "alpha": alpha,
            "beta": beta
        }
        return pred_inst, meta
