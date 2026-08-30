"""
Milestone 3 — Multi-Task Loss Functions Module (`losses.py`).
Combines Focal Semantic Loss, L1 Offset Loss, Cosine Directional Loss, and
Discriminative Instance Embedding Loss with background point masking.
Fixes in-place modification on cdist outputs for autograd safety.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Any, Tuple


class MultiTaskInstanceLoss(nn.Module):
    def __init__(
        self,
        lambda_offset: float = 1.0,
        lambda_dir: float = 0.5,
        lambda_emb: float = 0.2,
        focal_gamma: float = 2.0,
        focal_alpha: float = 0.25,
        delta_v: float = 0.2,
        delta_d: float = 1.5
    ):
        super().__init__()
        self.lambda_offset = lambda_offset
        self.lambda_dir = lambda_dir
        self.lambda_emb = lambda_emb
        self.focal_gamma = focal_gamma
        self.focal_alpha = focal_alpha
        self.delta_v = delta_v
        self.delta_d = delta_d

    def forward(
        self,
        preds: Dict[str, torch.Tensor],
        targets: Dict[str, torch.Tensor]
    ) -> Dict[str, torch.Tensor]:
        """
        Input:
            preds:
                - 'semantic_logits': [B, 2, N]
                - 'offset_pred': [B, 3, N]
                - 'embedding_pred': [B, 16, N]
            targets:
                - 'semantics': [B, N] (0=BG, 1=Building)
                - 'instances': [B, N] (0=BG, 1..K=Building IDs)
                - 'gt_offsets': [B, N, 3]
        """
        sem_logits = preds["semantic_logits"]   # [B, 2, N]
        off_pred = preds["offset_pred"]         # [B, 3, N]
        emb_pred = preds["embedding_pred"]       # [B, 16, N]

        sem_gt = targets["semantics"]           # [B, N]
        inst_gt = targets["instances"]          # [B, N]
        off_gt = targets["gt_offsets"]          # [B, N, 3]

        B, _, N = sem_logits.shape

        # 1. Focal Semantic Loss
        sem_probs = F.softmax(sem_logits, dim=1)  # [B, 2, N]
        p_t = sem_probs.gather(1, sem_gt.unsqueeze(1)).squeeze(1)  # [B, N]
        alpha_t = torch.where(sem_gt == 1, self.focal_alpha, 1.0 - self.focal_alpha)
        focal_loss = -alpha_t * ((1.0 - p_t) ** self.focal_gamma) * torch.log(p_t + 1e-8)
        loss_sem = torch.mean(focal_loss)

        # Mask for building points only
        bldg_mask = (sem_gt == 1)  # [B, N]
        n_bldg_pts = torch.sum(bldg_mask).item()

        if n_bldg_pts == 0:
            loss_offset = torch.tensor(0.0, device=sem_logits.device)
            loss_dir = torch.tensor(0.0, device=sem_logits.device)
            loss_emb = torch.tensor(0.0, device=sem_logits.device)
        else:
            off_pred_t = off_pred.transpose(1, 2)  # [B, N, 3]

            # 2. L1 Offset Loss (Building points only)
            off_diff = torch.abs(off_pred_t[bldg_mask] - off_gt[bldg_mask])
            loss_offset = torch.mean(off_diff)

            # 3. Cosine Directional Loss (Building points only)
            pred_dir = F.normalize(off_pred_t[bldg_mask], p=2, dim=-1)
            gt_dir = F.normalize(off_gt[bldg_mask], p=2, dim=-1)
            cos_sim = torch.sum(pred_dir * gt_dir, dim=-1)
            loss_dir = torch.mean(1.0 - cos_sim)

            # 4. Discriminative Instance Embedding Loss
            loss_emb = self.compute_discriminative_loss(emb_pred, inst_gt, bldg_mask)

        loss_total = (
            loss_sem +
            self.lambda_offset * loss_offset +
            self.lambda_dir * loss_dir +
            self.lambda_emb * loss_emb
        )

        return {
            "loss_total": loss_total,
            "loss_sem": loss_sem,
            "loss_offset": loss_offset,
            "loss_dir": loss_dir,
            "loss_emb": loss_emb
        }

    def compute_discriminative_loss(
        self,
        emb_pred: torch.Tensor,
        inst_gt: torch.Tensor,
        bldg_mask: torch.Tensor
    ) -> torch.Tensor:
        """
        Computes intra-cluster variance loss and inter-cluster distance loss.
        """
        B, C_emb, N = emb_pred.shape
        emb_t = emb_pred.transpose(1, 2)  # [B, N, C_emb]

        l_var_list = []
        l_dist_list = []

        for b in range(B):
            b_emb = emb_t[b]  # [N, C_emb]
            b_inst = inst_gt[b]  # [N]
            b_mask = bldg_mask[b]

            unique_instances = torch.unique(b_inst[b_mask])
            if len(unique_instances) == 0:
                continue

            instance_centers = []
            for inst_id in unique_instances:
                if inst_id == 0:
                    continue  # Ignore background
                i_mask = (b_inst == inst_id)
                i_emb = b_emb[i_mask]
                i_center = torch.mean(i_emb, dim=0)
                instance_centers.append(i_center)

                # Variance Loss (Intra-cluster pull)
                dist_to_center = torch.norm(i_emb - i_center, p=2, dim=-1)
                var_loss = torch.mean(F.relu(dist_to_center - self.delta_v) ** 2)
                l_var_list.append(var_loss)

            # Distance Loss (Inter-cluster push)
            num_centers = len(instance_centers)
            if num_centers >= 2:
                centers_tensor = torch.stack(instance_centers)  # [K, C_emb]
                dist_matrix = torch.cdist(centers_tensor, centers_tensor, p=2)
                eye_mask = torch.eye(num_centers, device=emb_pred.device).bool()
                # Out-of-place mask filling to avoid autograd in-place modification
                dist_matrix_masked = torch.where(eye_mask, 100.0, dist_matrix)
                dist_loss = torch.mean(F.relu(2.0 * self.delta_d - dist_matrix_masked) ** 2)
                l_dist_list.append(dist_loss)

        loss_var = torch.mean(torch.stack(l_var_list)) if len(l_var_list) > 0 else torch.tensor(0.0, device=emb_pred.device)
        loss_dist = torch.mean(torch.stack(l_dist_list)) if len(l_dist_list) > 0 else torch.tensor(0.0, device=emb_pred.device)

        return loss_var + loss_dist


if __name__ == "__main__":
    loss_fn = MultiTaskInstanceLoss()
    dummy_preds = {
        "semantic_logits": torch.randn(2, 2, 1024),
        "offset_pred": torch.randn(2, 3, 1024),
        "embedding_pred": torch.randn(2, 16, 1024)
    }
    dummy_targets = {
        "semantics": torch.randint(0, 2, (2, 1024)),
        "instances": torch.randint(0, 3, (2, 1024)),
        "gt_offsets": torch.randn(2, 1024, 3)
    }
    out = loss_fn(dummy_preds, dummy_targets)
    print("Computed Loss Values:")
    for k, v in out.items():
        print(f"  {k}: {v.item():.4f}")
