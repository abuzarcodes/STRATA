"""
Reproducibility Manifest Logger.
Outputs experiment_manifest.json containing exact model, dataset, preprocessing, and synthetic generator
versions along with reproducibility metadata and evaluation metric summaries.
"""

import json
import datetime
import platform
import subprocess
from pathlib import Path
from typing import Dict, Any


class ManifestLogger:
    """
    Generates and saves experiment_manifest.json for reproducibility.
    """

    MODEL_VERSION = "1.0.0-baseline"
    DATASET_VERSION = "synthetic_india_v1"
    PREPROCESSING_VERSION = "csf_hag_v1.0"
    SYNTHETIC_GENERATOR_VERSION = "phase_a_v1.0"

    def __init__(self, seed: int = 42):
        self.seed = seed

    def log_manifest(
        self,
        metrics_summary: Dict[str, Any],
        pipeline_params: Dict[str, Any],
        output_path: str = "experiment_manifest.json"
    ) -> Dict[str, Any]:
        """
        Creates and exports manifest JSON.
        """
        manifest_id = f"EXP_{datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d_%H%M%S')}"

        git_hash = self._get_git_commit()

        manifest_doc = {
            "manifest_id": manifest_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "versions": {
                "model_version": self.MODEL_VERSION,
                "dataset_version": self.DATASET_VERSION,
                "preprocessing_version": self.PREPROCESSING_VERSION,
                "synthetic_generator_version": self.SYNTHETIC_GENERATOR_VERSION
            },
            "reproducibility": {
                "git_commit": git_hash,
                "random_seed": self.seed,
                "python_version": platform.python_version(),
                "platform": platform.platform()
            },
            "pipeline_hyperparameters": pipeline_params,
            "metrics_summary": metrics_summary
        }

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(manifest_doc, f, indent=2)

        return manifest_doc

    def _get_git_commit(self) -> str:
        """Retrieves git commit hash if available, else fallback."""
        try:
            res = subprocess.run(
                ["git", "rev-parse", "--short", "HEAD"],
                capture_output=True,
                text=True,
                check=True
            )
            return res.stdout.strip()
        except Exception:
            return "untracked_repo"
