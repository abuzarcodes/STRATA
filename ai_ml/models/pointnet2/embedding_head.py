"""
Milestone 3 — Discriminative Feature Embedding Head Module.
Predicts per-point 16D feature vectors [B, 16, N] for instance similarity matching.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class EmbeddingHead(nn.Module):
    def __init__(self, in_channels: int = 128, emb_dim: int = 16):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, 64, 1)
        self.bn1 = nn.BatchNorm1d(64)
        self.conv2 = nn.Conv1d(64, emb_dim, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Input:
            x: per-point features, [B, 128, N]
        Output:
            embeddings: L2-normalized 16D feature embeddings, [B, 16, N]
        """
        x = F.relu(self.bn1(self.conv1(x)))
        embeddings = self.conv2(x)
        embeddings = F.normalize(embeddings, p=2, dim=1)  # L2 normalization
        return embeddings
