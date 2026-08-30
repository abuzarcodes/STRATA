"""
Milestone 3 — PyTorch Dataset V2 (`dataset_v2.py`).
Provides scene-level PyTorch Dataset and Dataloader for PointNet2_MSG_DualHead_v1.
Enforces scene-level partitioning (Train 70%, Val 15%, Test 15%).
Fixes input features default: [X_norm, Y_norm, Z_norm, Intensity] (no default HAG).
Optimized for fast on-the-fly synthetic scene generation.
"""

import sys
import os
import torch
from torch.utils.data import Dataset, DataLoader
import numpy as np
from pathlib import Path
from typing import Dict, Any, List, Tuple

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.synthetic.synthetic_v2 import SyntheticSceneGeneratorV2


class PointCloudInstanceDataset(Dataset):
    def __init__(
        self,
        num_scenes: int = 280,
        num_points: int = 4096,
        seed_offset: int = 1000,
        feature_mode: str = "XYZ_Intensity"
    ):
        self.num_scenes = num_scenes
        self.num_points = num_points
        self.seed_offset = seed_offset
        self.feature_mode = feature_mode
        self.generator = SyntheticSceneGeneratorV2()
        self.setback_options = [4.0, 3.0, 2.0, 1.5, 1.0, 0.5, 0.0]

    def __len__(self) -> int:
        return self.num_scenes

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        scene_seed = self.seed_offset + idx
        self.generator.seed = scene_seed
        self.generator.rng = np.random.RandomState(scene_seed)

        setback = self.setback_options[idx % len(self.setback_options)]
        attached = (setback == 0.0)
        same_h = (idx % 3 == 0)
        slope = (idx % 4) * 3.5
        dens = 20.0 + (idx % 3) * 5.0
        dropout = (idx % 4) * 0.05

        sc = self.generator.generate_scene(
            num_buildings=2,
            setback_m=setback,
            same_height=same_h,
            attached=attached,
            terrain_slope_deg=slope,
            target_density_pts_per_sqm=dens,
            dropout_rate=dropout,
            has_vegetation=True
        )

        pts_xyz = sc["points_xyz"]
        feats_5d = sc["features_5d"]  # [X_norm, Y_norm, Z_norm, HAG, Intensity]
        sem = sc["semantics"]
        inst = sc["instances"]
        offsets = sc["gt_offsets"]

        N_raw = len(pts_xyz)

        if N_raw >= self.num_points:
            choice = np.random.choice(N_raw, self.num_points, replace=False)
        else:
            choice = np.random.choice(N_raw, self.num_points, replace=True)

        pts_xyz_s = pts_xyz[choice]
        feats_5d_s = feats_5d[choice]
        sem_s = sem[choice]
        inst_s = inst[choice]
        offsets_s = offsets[choice]

        if self.feature_mode == "XYZ":
            feats = feats_5d_s[:, :3]
        elif self.feature_mode == "XYZ_HAG":
            feats = feats_5d_s[:, :4]
        elif self.feature_mode == "XYZ_Intensity":
            feats = feats_5d_s[:, [0, 1, 2, 4]]
        elif self.feature_mode == "XYZ_HAG_Intensity":
            feats = feats_5d_s[:, :5]
        else:
            raise ValueError(f"Unknown feature_mode: {self.feature_mode}")

        return {
            "pos": torch.tensor(pts_xyz_s, dtype=torch.float32),
            "features": torch.tensor(feats, dtype=torch.float32),
            "semantics": torch.tensor(sem_s, dtype=torch.long),
            "instances": torch.tensor(inst_s, dtype=torch.long),
            "gt_offsets": torch.tensor(offsets_s, dtype=torch.float32)
        }


def get_dataloaders(
    batch_size: int = 4,
    num_points: int = 4096,
    feature_mode: str = "XYZ_Intensity"
) -> Tuple[DataLoader, DataLoader, DataLoader]:

    train_dataset = PointCloudInstanceDataset(
        num_scenes=280, num_points=num_points, seed_offset=1000, feature_mode=feature_mode
    )
    val_dataset = PointCloudInstanceDataset(
        num_scenes=60, num_points=num_points, seed_offset=2000, feature_mode=feature_mode
    )
    test_dataset = PointCloudInstanceDataset(
        num_scenes=60, num_points=num_points, seed_offset=3000, feature_mode=feature_mode
    )

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, drop_last=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    return train_loader, val_loader, test_loader
