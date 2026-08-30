"""
Milestone 3 — PointNet++ Set Abstraction Module with Multi-Scale Grouping (MSG).
Pure PyTorch implementation of Farthest Point Sampling (FPS) and Ball Querying.
Supports multi-scale neighborhood radii grouping without external CUDA C++ dependencies.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Tuple


def farthest_point_sample(xyz: torch.Tensor, npoint: int) -> torch.Tensor:
    """
    Input:
        xyz: point cloud data, [B, N, 3]
        npoint: number of samples
    Return:
        centroids: sampled point indices, [B, npoint]
    """
    device = xyz.device
    B, N, C = xyz.shape
    centroids = torch.zeros(B, npoint, dtype=torch.long, device=device)
    distance = torch.ones(B, N, device=device) * 1e10
    farthest = torch.randint(0, N, (B,), dtype=torch.long, device=device)
    batch_indices = torch.arange(B, dtype=torch.long, device=device)

    for i in range(npoint):
        centroids[:, i] = farthest
        centroid = xyz[batch_indices, farthest, :].view(B, 1, 3)
        dist = torch.sum((xyz - centroid) ** 2, -1)
        mask = dist < distance
        distance[mask] = dist[mask]
        farthest = torch.max(distance, -1)[1]

    return centroids


def query_ball_point(radius: float, nsample: int, xyz: torch.Tensor, new_xyz: torch.Tensor) -> torch.Tensor:
    """
    Input:
        radius: local sphere radius
        nsample: max sample number in local sphere
        xyz: all points, [B, N, 3]
        new_xyz: sampled centers, [B, S, 3]
    Return:
        group_idx: grouped point indices, [B, S, nsample]
    """
    device = xyz.device
    B, N, C = xyz.shape
    _, S, _ = new_xyz.shape

    # Compute pairwise Euclidean distance squared
    sqrdists = torch.cdist(new_xyz, xyz, p=2) ** 2

    # Mask points outside radius
    group_idx = torch.arange(N, dtype=torch.long, device=device).view(1, 1, N).repeat(B, S, 1)
    group_idx[sqrdists > radius ** 2] = N  # Temporary invalid index

    group_idx = torch.sort(group_idx, dim=-1)[0][:, :, :nsample]
    group_first = group_idx[:, :, 0].view(B, S, 1).repeat(1, 1, nsample)
    mask = group_idx == N
    group_idx[mask] = group_first[mask]

    return group_idx


class PointNetSetAbstractionMSG(nn.Module):
    def __init__(
        self,
        npoint: int,
        radius_list: List[float],
        nsample_list: List[int],
        in_channel: int,
        mlp_list: List[List[int]]
    ):
        super().__init__()
        self.npoint = npoint
        self.radius_list = radius_list
        self.nsample_list = nsample_list

        self.conv_blocks = nn.ModuleList()
        self.bn_blocks = nn.ModuleList()

        for i in range(len(radius_list)):
            convs = nn.ModuleList()
            bns = nn.ModuleList()
            last_channel = in_channel + 3
            for out_channel in mlp_list[i]:
                convs.append(nn.Conv2d(last_channel, out_channel, 1))
                bns.append(nn.BatchNorm2d(out_channel))
                last_channel = out_channel
            self.conv_blocks.append(convs)
            self.bn_blocks.append(bns)

    def forward(self, xyz: torch.Tensor, points: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Input:
            xyz: input points position, [B, N, 3]
            points: input points feature, [B, C, N]
        Return:
            new_xyz: sampled points position, [B, S, 3]
            new_points_concat: sampled points feature, [B, C_out, S]
        """
        B, N, C = xyz.shape
        S = self.npoint

        fps_idx = farthest_point_sample(xyz, S)
        new_xyz = xyz[torch.arange(B).unsqueeze(-1), fps_idx, :]  # [B, S, 3]

        new_points_list = []
        for i in range(len(self.radius_list)):
            radius = self.radius_list[i]
            nsample = self.nsample_list[i]
            group_idx = query_ball_point(radius, nsample, xyz, new_xyz)  # [B, S, nsample]

            # Gather xyz & features
            grouped_xyz = xyz[torch.arange(B).view(B, 1, 1), group_idx, :]  # [B, S, nsample, 3]
            grouped_xyz_norm = grouped_xyz - new_xyz.view(B, S, 1, 3)

            if points is not None:
                points_t = points.transpose(1, 2)  # [B, N, C_feat]
                grouped_points = points_t[torch.arange(B).view(B, 1, 1), group_idx, :]  # [B, S, nsample, C_feat]
                grouped_points = torch.cat([grouped_xyz_norm, grouped_points], dim=-1)
            else:
                grouped_points = grouped_xyz_norm

            grouped_points = grouped_points.permute(0, 3, 1, 2)  # [B, C_in+3, S, nsample]

            for conv, bn in zip(self.conv_blocks[i], self.bn_blocks[i]):
                grouped_points = F.relu(bn(conv(grouped_points)))

            new_points = torch.max(grouped_points, -1)[0]  # [B, C_out, S]
            new_points_list.append(new_points)

        new_points_concat = torch.cat(new_points_list, dim=1)
        return new_xyz, new_points_concat
