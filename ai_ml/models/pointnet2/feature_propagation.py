"""
Milestone 3 — PointNet++ Feature Propagation (FP) Interpolation Module.
Interpolates features from sub-sampled points back to higher-density points using inverse distance weighting.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List


class PointNetFeaturePropagation(nn.Module):
    def __init__(self, in_channel: int, mlp: List[int]):
        super().__init__()
        self.convs = nn.ModuleList()
        self.bns = nn.ModuleList()

        last_channel = in_channel
        for out_channel in mlp:
            self.convs.append(nn.Conv1d(last_channel, out_channel, 1))
            self.bns.append(nn.BatchNorm1d(out_channel))
            last_channel = out_channel

    def forward(
        self,
        xyz1: torch.Tensor,
        xyz2: torch.Tensor,
        points1: torch.Tensor,
        points2: torch.Tensor
    ) -> torch.Tensor:
        """
        Input:
            xyz1: target interpolation positions, [B, N, 3]
            xyz2: sub-sampled positions, [B, S, 3]
            points1: target points features, [B, C1, N] (optional)
            points2: sub-sampled points features, [B, C2, S]
        Return:
            new_points: interpolated features, [B, C_out, N]
        """
        B, N, C = xyz1.shape
        _, S, _ = xyz2.shape

        if S == 1:
            interpolated_points = points2.repeat(1, 1, N)
        else:
            dists = torch.cdist(xyz1, xyz2, p=2)  # [B, N, S]
            dists, idx = torch.sort(dists, dim=-1)
            dists, idx = dists[:, :, :3], idx[:, :, :3]  # 3 nearest neighbors

            dist_recip = 1.0 / (dists + 1e-10)
            norm = torch.sum(dist_recip, dim=2, keepdim=True)
            weight = dist_recip / norm  # [B, N, 3]

            points2_t = points2.transpose(1, 2)  # [B, S, C2]
            interpolated_points = torch.zeros(B, N, points2.shape[1], device=xyz1.device)

            for i in range(3):
                idx_i = idx[:, :, i].unsqueeze(-1).repeat(1, 1, points2.shape[1])
                p2_gathered = torch.gather(points2_t, 1, idx_i)
                w_i = weight[:, :, i].unsqueeze(-1)
                interpolated_points += p2_gathered * w_i

            interpolated_points = interpolated_points.transpose(1, 2)  # [B, C2, N]

        if points1 is not None:
            new_points = torch.cat([points1, interpolated_points], dim=1)
        else:
            new_points = interpolated_points

        for conv, bn in zip(self.convs, self.bns):
            new_points = F.relu(bn(conv(new_points)))

        return new_points
