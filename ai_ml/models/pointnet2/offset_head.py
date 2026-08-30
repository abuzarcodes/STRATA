"""
Milestone 3 — 3D Centroid Offset Regression Head Module.
Predicts per-point 3D displacement vectors [B, 3, N] (ΔX, ΔY, ΔZ).
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class OffsetHead(nn.Module):
    def __init__(self, in_channels: int = 128):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, 64, 1)
        self.bn1 = nn.BatchNorm1d(64)
        self.conv2 = nn.Conv1d(64, 3, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Input:
            x: per-point features, [B, 128, N]
        Output:
            offsets: 3D displacement vectors, [B, 3, N]
        """
        x = F.relu(self.bn1(self.conv1(x)))
        offsets = self.conv2(x)
        return offsets
