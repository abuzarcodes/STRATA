"""
Cross-Tile Instance Reconciler (`cross_tile_reconciler.py`).
Merges building candidate instances that cross 40m tile boundaries.
Uses globally transformed coordinates and spatial centroid proximity.
Prevents duplicate building candidates and artificial splitting at tile boundaries.
"""

from typing import List, Dict, Any
import numpy as np

class CrossTileInstanceReconciler:
    @staticmethod
    def reconcile_instances(tile_candidates: List[Dict[str, Any]], match_dist_m: float = 3.0) -> List[Dict[str, Any]]:
        if len(tile_candidates) == 0:
            return []

        reconciled = []
        visited = set()

        for i in range(len(tile_candidates)):
            if i in visited:
                continue

            c1 = tile_candidates[i]
            cent1 = np.array([c1["geometry"]["centroid"]["x"], c1["geometry"]["centroid"]["y"]])
            merged_pts_count = c1["point_count"]
            merged_tiles = list(c1["source_tiles"])

            visited.add(i)

            for j in range(i + 1, len(tile_candidates)):
                if j in visited:
                    continue

                c2 = tile_candidates[j]
                cent2 = np.array([c2["geometry"]["centroid"]["x"], c2["geometry"]["centroid"]["y"]])
                dist = np.linalg.norm(cent1 - cent2)

                if dist <= match_dist_m:
                    visited.add(j)
                    merged_pts_count += c2["point_count"]
                    merged_tiles.extend(c2["source_tiles"])

            c1_copy = dict(c1)
            c1_copy["point_count"] = merged_pts_count
            c1_copy["source_tiles"] = list(set(merged_tiles))
            reconciled.append(c1_copy)

        return reconciled
