"""
Milestone 3 — Semantic Classification Head Module.
Predicts per-point building vs background logits [B, 2, N].
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class SemanticHead(nn.Module):
    def __init__(self, in_channels: int = 128, num_classes: int = 2):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, 64, 1)
        self.bn1 = nn.BatchNorm1d(64)
        self.drop1 = nn.Dropout(0.3)
        self.conv2 = nn.Conv1d(64, num_classes, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Input:
            x: per-point features, [B, 128, N]
        Output:
            logits: semantic logits, [B, 2, N]
        """
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.drop1(x)
        logits = self.conv2(x)
        return logits
