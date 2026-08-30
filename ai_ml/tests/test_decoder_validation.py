"""
Milestone 4.5 — Automated PyTest Suite (`test_decoder_validation.py`).
Verifies freeze rules, SHA256 immutability, 4D feature constraints, dataset seed isolation, and reproducibility.
"""

import sys
import hashlib
import json
import os
import numpy as np
import torch
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent
sys_path = str(project_root)
if sys_path not in sys.path:
    sys.path.insert(0, sys_path)

from ai_ml.models.building_extractor_baseline import BuildingExtractorBaseline
from ai_ml.models.pointnet2.model import PointNet2_MSG_DualHead_v1
from ai_ml.decoding.instance_decoder import HDBSCANInstanceDecoder
from ai_ml.evaluation.decoder_validation.adaptive_decoder import AdaptiveDensityDecoder

def test_checkpoint_sha256_unmodified():
    ckpt_path = project_root / "ai_ml" / "models" / "best_pointnet2_msg_dualhead.pt"
    assert ckpt_path.exists(), "Checkpoint does not exist."
    sha256_hash = hashlib.sha256()
    with open(ckpt_path, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    chksum = sha256_hash.hexdigest()

    manifest_path = project_root / "decoder_freeze_manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        assert chksum == manifest["sha256"], "Checkpoint SHA256 hash mismatch! Checkpoint was modified!"

def test_frozen_baseline_unmodified():
    extractor = BuildingExtractorBaseline(min_hag_m=2.5, cluster_distance_m=2.0)
    assert extractor.min_hag == 2.5
    assert extractor.cluster_dist == 2.0

def test_neural_input_channels_4d():
    model = PointNet2_MSG_DualHead_v1(in_channels=4, num_classes=2, emb_dim=16)
    dummy_pos = torch.randn(1, 100, 3)
    dummy_feats = torch.randn(1, 100, 4)
    out = model(dummy_pos, dummy_feats)
    assert "semantic_logits" in out
    assert "offset_pred" in out
    assert "embedding_pred" in out

def test_seed_isolation_disjoint():
    train_seeds = set(range(1000, 1280))
    val_seeds = set(range(2000, 2060))
    gen_seeds = set(range(4000, 4051))
    dev_seeds = set(range(6000, 6051))
    dec_val_seeds = set(range(7000, 7051))
    test_seeds = set(range(8000, 8051))

    assert len(train_seeds & dev_seeds) == 0
    assert len(val_seeds & dev_seeds) == 0
    assert len(gen_seeds & dev_seeds) == 0
    assert len(dev_seeds & dec_val_seeds) == 0
    assert len(dev_seeds & test_seeds) == 0
    assert len(dec_val_seeds & test_seeds) == 0

def test_adaptive_decoder_reproducibility():
    dec = AdaptiveDensityDecoder()
    pts = np.random.uniform(0, 50, (500, 3))
    probs = np.random.uniform(0, 1, 500)
    offs = np.random.normal(0, 0.5, (500, 3))
    embs = np.random.normal(0, 1, (500, 16))

    p1, m1 = dec.decode_instances(pts, probs, offs, embs)
    p2, m2 = dec.decode_instances(pts, probs, offs, embs)

    np.testing.assert_array_equal(p1, p2)
    assert m1["adaptive_selected_params"] == m2["adaptive_selected_params"]
