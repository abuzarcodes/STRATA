"""
Milestone 3 — Model Training & Validation Orchestrator (`train_ml.py`).
Trains `PointNet2_MSG_DualHead_v1` on 280 synthetic train scenes, validates on 60 val scenes,
monitors multi-task loss, saves best model checkpoint, and measures real peak VRAM allocation.
"""

import sys
import os
import json
import time
from typing import Dict, Any, List
import torch
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.datasets.dataset_v2 import get_dataloaders
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.models.losses import MultiTaskInstanceLoss
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.instance_metrics import InstanceEvaluationMetrics


def train_ml_model(
    epochs: int = 12,
    batch_size: int = 4,
    num_points: int = 4096,
    lr: float = 0.001,
    feature_mode: str = "XYZ_Intensity",
    device_name: str = None
) -> Dict[str, Any]:
    """
    Trains PointNet2_MSG_DualHead_v1 model and evaluates on validation set.
    """
    if device_name is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(device_name)

    print("============================================================")
    print(f" Training PointNet2_MSG_DualHead_v1 on {device}")
    print(f" Config: Epochs={epochs}, BatchSize={batch_size}, NumPoints={num_points}, FeatureMode={feature_mode}")
    print("============================================================")

    train_loader, val_loader, test_loader = get_dataloaders(
        batch_size=batch_size, num_points=num_points, feature_mode=feature_mode
    )

    if feature_mode == "XYZ":
        in_channels = 3
    elif feature_mode in ["XYZ_HAG", "XYZ_Intensity"]:
        in_channels = 4
    elif feature_mode == "XYZ_HAG_Intensity":
        in_channels = 5
    else:
        raise ValueError(f"Unknown feature_mode: {feature_mode}")
    model = PointNet2_MSG_DualHead_v1(in_channels=in_channels, num_classes=2, emb_dim=16).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=4, gamma=0.5)

    loss_fn = MultiTaskInstanceLoss()
    decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)

    best_val_loss = float('inf')
    best_val_f1 = 0.0
    checkpoint_dir = project_root / "ai_ml" / "models"
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    best_model_path = checkpoint_dir / "best_pointnet2_msg_dualhead.pt"

    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
        t0_train = time.time()

    history = []

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss_list = []

        for batch in train_loader:
            pos = batch["pos"].to(device)                # [B, N, 3]
            feats = batch["features"].to(device)         # [B, N, C]
            sem_gt = batch["semantics"].to(device)       # [B, N]
            inst_gt = batch["instances"].to(device)      # [B, N]
            off_gt = batch["gt_offsets"].to(device)      # [B, N, 3]

            optimizer.zero_grad()
            out = model(pos, feats)

            targets = {"semantics": sem_gt, "instances": inst_gt, "gt_offsets": off_gt}
            loss_dict = loss_fn(out, targets)
            loss = loss_dict["loss_total"]

            loss.backward()
            optimizer.step()
            train_loss_list.append(loss.item())

        scheduler.step()
        avg_train_loss = float(np.mean(train_loss_list))

        # Validation Loop
        model.eval()
        val_loss_list = []
        val_f1_list = []

        with torch.no_grad():
            for batch in val_loader:
                pos = batch["pos"].to(device)
                feats = batch["features"].to(device)
                sem_gt = batch["semantics"].to(device)
                inst_gt = batch["instances"].to(device)
                off_gt = batch["gt_offsets"].to(device)

                out = model(pos, feats)
                targets = {"semantics": sem_gt, "instances": inst_gt, "gt_offsets": off_gt}
                l_dict = loss_fn(out, targets)
                val_loss_list.append(l_dict["loss_total"].item())

                sem_probs = torch.softmax(out["semantic_logits"], dim=1)[0, 1].cpu().numpy()
                off_pred = out["offset_pred"][0].transpose(0, 1).cpu().numpy()
                emb_pred = out["embedding_pred"][0].transpose(0, 1).cpu().numpy()
                pts_xyz = pos[0].cpu().numpy()
                gt_inst = inst_gt[0].cpu().numpy()

                pred_inst, _ = decoder.decode_instances(pts_xyz, sem_probs, off_pred, emb_pred)
                m = InstanceEvaluationMetrics.calculate_instance_metrics(pred_inst, gt_inst)
                val_f1_list.append(m["instance_f1"])

        avg_val_loss = float(np.mean(val_loss_list))
        avg_val_f1 = float(np.mean(val_f1_list))

        print(f"Epoch [{epoch:02d}/{epochs:02d}] - Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val Inst F1: {avg_val_f1:.4f}")

        history.append({
            "epoch": epoch,
            "train_loss": round(avg_train_loss, 4),
            "val_loss": round(avg_val_loss, 4),
            "val_instance_f1": round(avg_val_f1, 4)
        })

        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            best_val_f1 = avg_val_f1
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "best_val_loss": best_val_loss,
                "best_val_f1": best_val_f1,
                "feature_mode": feature_mode
            }, best_model_path)
            print(f"  --> Saved new best checkpoint to: {best_model_path}")

    if torch.cuda.is_available():
        peak_vram_gb = torch.cuda.max_memory_allocated(device) / 1e9
        total_train_time_sec = time.time() - t0_train
    else:
        peak_vram_gb = 0.0
        total_train_time_sec = 0.0

    param_count = sum(p.numel() for p in model.parameters() if p.requires_grad)

    print("\nTraining Complete!")
    print(f"Measured Peak VRAM: {peak_vram_gb:.3f} GB")
    print(f"Total Model Parameters: {param_count:,}")
    print(f"Total Training Latency: {total_train_time_sec:.2f} seconds")

    return {
        "best_model_path": str(best_model_path),
        "best_val_loss": round(best_val_loss, 4),
        "best_val_instance_f1": round(best_val_f1, 4),
        "measured_hardware_benchmarks": {
            "peak_vram_allocated_gb": round(peak_vram_gb, 3),
            "total_train_time_sec": round(total_train_time_sec, 2),
            "model_parameter_count": param_count,
            "device": str(device)
        },
        "training_history": history
    }


if __name__ == "__main__":
    train_ml_model(epochs=12, batch_size=4, num_points=4096)
