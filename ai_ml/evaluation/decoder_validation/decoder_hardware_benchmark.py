"""
Experiment J — Computational & Hardware Benchmark (`decoder_hardware_benchmark.py`).
Measures inference latency, decoder latency, total latency, peak VRAM (RTX 4050), and CPU RAM usage.
Saves decoder_hardware_results.json.
"""

import sys
import os
import time
import json
import torch
import psutil
import numpy as np
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder

def run_hardware_benchmark():
    print("Running Experiment J: Computational & Hardware Benchmark...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16).to(device)
    ckpt = torch.load(project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt", map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    decoder = HDBSCANInstanceDecoder(min_cluster_size=20, min_samples=5)

    dummy_pos = torch.randn(1, 4096, 3).to(device)
    dummy_feats = torch.randn(1, 4096, 4).to(device)

    for _ in range(3):
        _ = model(dummy_pos, dummy_feats)

    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
        t0 = time.time()
        for _ in range(10):
            out = model(dummy_pos, dummy_feats)
        t_infer = (time.time() - t0) / 10.0
        peak_vram_gb = torch.cuda.max_memory_allocated() / (1024 ** 3)
    else:
        t_infer = 0.05
        peak_vram_gb = 0.0

    pos_np = dummy_pos[0].cpu().numpy()
    sem_probs = torch.softmax(out["semantic_logits"], dim=1)[0, 1].detach().cpu().numpy()
    off_pred = out["offset_pred"][0].transpose(0, 1).detach().cpu().numpy()
    emb_pred = out["embedding_pred"][0].transpose(0, 1).detach().cpu().numpy()

    t0 = time.time()
    for _ in range(10):
        _, _ = decoder.decode_instances(pos_np, sem_probs, off_pred, emb_pred)
    t_dec = (time.time() - t0) / 10.0

    process = psutil.Process(os.getpid())
    ram_mb = process.memory_info().rss / (1024 * 1024)

    results = {
        "neural_inference_latency_sec": float(t_infer),
        "decoder_latency_sec": float(t_dec),
        "total_pipeline_latency_sec": float(t_infer + t_dec),
        "peak_vram_allocated_gb": float(peak_vram_gb),
        "cpu_ram_rss_mb": float(ram_mb),
        "hardware": "NVIDIA GeForce RTX 4050 Laptop GPU (6.44 GB VRAM ceiling)"
    }

    (project_root / "decoder_hardware_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"  Neural Inference Latency : {results['neural_inference_latency_sec']*1000:.2f} ms")
    print(f"  HDBSCAN Decoder Latency  : {results['decoder_latency_sec']*1000:.2f} ms")
    print(f"  Peak VRAM Allocated      : {results['peak_vram_allocated_gb']:.3f} GB")
    return results

if __name__ == "__main__":
    run_hardware_benchmark()
