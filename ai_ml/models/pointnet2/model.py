"""
Milestone 3 — Full PointNet2_MSG_DualHead_v1 Architecture Implementation.
Combines PointNet++ Set Abstraction MSG, Feature Propagation,
Semantic Head [B, 2, N], Offset Head [B, 3, N], and Embedding Head [B, 16, N].
"""

import torch
import torch.nn as nn
from typing import Dict, Any, Tuple

from ai_ml.models.pointnet2.set_abstraction import PointNetSetAbstractionMSG
from ai_ml.models.pointnet2.feature_propagation import PointNetFeaturePropagation
from ai_ml.models.pointnet2.semantic_head import SemanticHead
from ai_ml.models.pointnet2.offset_head import OffsetHead
from ai_ml.models.pointnet2.embedding_head import EmbeddingHead


class PointNet2_MSG_DualHead_v1(nn.Module):
    def __init__(
        self,
        in_channels: int = 4,  # Default: [X_norm, Y_norm, Z_norm, Intensity]
        num_classes: int = 2,
        emb_dim: int = 16
    ):
        super().__init__()
        self.in_channels = in_channels

        # SA1: N_pts = 1024, Radii = [0.5m, 1.0m]
        self.sa1 = PointNetSetAbstractionMSG(
            npoint=1024,
            radius_list=[0.5, 1.0],
            nsample_list=[16, 32],
            in_channel=in_channels - 3,
            mlp_list=[[32, 32, 64], [32, 64, 64]]
        )

        # SA2: N_pts = 256, Radii = [1.0m, 2.0m]
        self.sa2 = PointNetSetAbstractionMSG(
            npoint=256,
            radius_list=[1.0, 2.0],
            nsample_list=[32, 64],
            in_channel=128,  # 64 + 64 from SA1
            mlp_list=[[64, 64, 128], [64, 96, 128]]
        )

        # SA3: N_pts = 64, Radii = [2.0m, 4.0m]
        self.sa3 = PointNetSetAbstractionMSG(
            npoint=64,
            radius_list=[2.0, 4.0],
            nsample_list=[64, 128],
            in_channel=256,  # 128 + 128 from SA2
            mlp_list=[[128, 128, 256], [128, 196, 256]]
        )

        # FP Layers
        self.fp3 = PointNetFeaturePropagation(in_channel=256 + 512, mlp=[256, 256])
        self.fp2 = PointNetFeaturePropagation(in_channel=128 + 256, mlp=[128, 128])
        self.fp1 = PointNetFeaturePropagation(in_channel=(in_channels - 3) + 128, mlp=[128, 128])

        # Dual Heads
        self.semantic_head = SemanticHead(in_channels=128, num_classes=num_classes)
        self.offset_head = OffsetHead(in_channels=128)
        self.embedding_head = EmbeddingHead(in_channels=128, emb_dim=emb_dim)

    def forward(self, pos: torch.Tensor, features: torch.Tensor) -> Dict[str, torch.Tensor]:
        """
        Input:
            pos: [B, N, 3] (XYZ positions)
            features: [B, N, C] (Input features, e.g. C=4 for X,Y,Z,Intensity)
        Return:
            dict containing:
                - 'semantic_logits': [B, 2, N]
                - 'offset_pred': [B, 3, N]
                - 'embedding_pred': [B, 16, N]
        """
        B, N, _ = pos.shape

        # Extract non-XYZ channels for points
        if features.shape[-1] > 3:
            points = features[:, :, 3:].transpose(1, 2)  # [B, C-3, N]
        else:
            points = None

        # Encoder (SA layers)
        l1_xyz, l1_points = self.sa1(pos, points)
        l2_xyz, l2_points = self.sa2(l1_xyz, l1_points)
        l3_xyz, l3_points = self.sa3(l2_xyz, l2_points)

        # Decoder (FP layers)
        l2_fp = self.fp3(l2_xyz, l3_xyz, l2_points, l3_points)
        l1_fp = self.fp2(l1_xyz, l2_xyz, l1_points, l2_fp)
        l0_fp = self.fp1(pos, l1_xyz, points, l1_fp)  # [B, 128, N]

        # Heads
        sem_logits = self.semantic_head(l0_fp)    # [B, 2, N]
        off_pred = self.offset_head(l0_fp)        # [B, 3, N]
        emb_pred = self.embedding_head(l0_fp)      # [B, 16, N]

        return {
            "semantic_logits": sem_logits,
            "offset_pred": off_pred,
            "embedding_pred": emb_pred
        }


if __name__ == "__main__":
    net = PointNet2_MSG_DualHead_v1(in_channels=4)
    dummy_pos = torch.randn(2, 2048, 3)
    dummy_feats = torch.randn(2, 2048, 4)
    out = net(dummy_pos, dummy_feats)
    print("Forward Pass Shapes:")
    print("  Sem Logits:", out["semantic_logits"].shape)
    print("  Offset Pred:", out["offset_pred"].shape)
    print("  Embedding Pred:", out["embedding_pred"].shape)
