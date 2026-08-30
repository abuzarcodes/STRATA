"""
Milestone 3 — Phase 9: Tiny Overfit Verification Test (`overfit_tiny_test.py`).
Verifies that PointNet2_MSG_DualHead_v1 can intentionally overfit a tiny 2-scene synthetic dataset,
proving that gradients flow correctly and loss drops smoothly.
"""

import sys
import torch
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.datasets.dataset_v2 import PointCloudInstanceDataset
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.models.losses import MultiTaskInstanceLoss


def run_overfit_test():
    print("============================================================")
    print(" Phase 9: Running Tiny Dataset Overfit Verification Test")
    print("============================================================")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    dataset = PointCloudInstanceDataset(num_scenes=2, num_points=1024, seed_offset=42, feature_mode="XYZ_Intensity")
    loader = torch.utils.data.DataLoader(dataset, batch_size=2, shuffle=False)

    model = PointNet2_MSG_DualHead_v1(in_channels=4).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.005)
    loss_fn = MultiTaskInstanceLoss()

    batch = next(iter(loader))
    pos = batch["pos"].to(device)
    feats = batch["features"].to(device)
    sem_gt = batch["semantics"].to(device)
    inst_gt = batch["instances"].to(device)
    off_gt = batch["gt_offsets"].to(device)

    targets = {"semantics": sem_gt, "instances": inst_gt, "gt_offsets": off_gt}

    initial_loss = 0.0
    final_loss = 0.0

    for step in range(1, 31):
        model.train()
        optimizer.zero_grad()
        out = model(pos, feats)
        loss_dict = loss_fn(out, targets)
        loss = loss_dict["loss_total"]

        loss.backward()
        optimizer.step()

        if step == 1:
            initial_loss = loss.item()
        final_loss = loss.item()

        if step % 10 == 0 or step == 1:
            print(f"Step [{step:02d}/30] - Loss Total: {loss.item():.4f} (Sem: {loss_dict['loss_sem'].item():.4f}, Off: {loss_dict['loss_offset'].item():.4f}, Emb: {loss_dict['loss_emb'].item():.4f})")

    assert final_loss < initial_loss, f"Loss did not decrease! Initial: {initial_loss}, Final: {final_loss}"
    print(f"\nOVERFIT TEST PASSED! Loss decreased from {initial_loss:.4f} to {final_loss:.4f} 🟢")


if __name__ == "__main__":
    run_overfit_test()
