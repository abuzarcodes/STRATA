"""
Developer Visual Debugger Tool (`ai_ml/visualization/dev_visualizer.py`).
Renders 2D top-down ASCII grid visualizations and HTML reports showing:
- Original Point Cloud Bounds
- Ground Truth Building Footprint
- Predicted Building Footprint
- False Positives & False Negatives
- Detected Roof Heights & Candidate Floor Z-levels
"""

import json
from pathlib import Path
from typing import Dict, Any, List
import numpy as np


class DevVisualizer:
    """
    Renders developer-facing visual debug inspection reports for AI validation.
    """

    @staticmethod
    def render_ascii_footprint(
        points: np.ndarray,
        pred_mask: np.ndarray,
        gt_mask: np.ndarray,
        grid_size: int = 30
    ) -> str:
        """
        Renders a 2D top-down ASCII grid visualization of building extraction:
        - '.' = Ground / Non-building
        - '#' = True Positive Building
        - 'F' = False Positive (Predicted as building, but GT is not)
        - 'M' = Missed / False Negative (GT building point missed by baseline)
        """
        if len(points) == 0:
            return "Empty Point Cloud"

        x = points[:, 0]
        y = points[:, 1]

        x_min, x_max = x.min(), x.max()
        y_min, y_max = y.min(), y.max()

        x_bins = np.linspace(x_min, x_max, grid_size)
        y_bins = np.linspace(y_min, y_max, grid_size)

        grid = [["." for _ in range(grid_size)] for _ in range(grid_size)]

        for i in range(len(points)):
            gx = min(grid_size - 1, int((points[i, 0] - x_min) / (x_max - x_min + 1e-5) * grid_size))
            gy = min(grid_size - 1, int((points[i, 1] - y_min) / (y_max - y_min + 1e-5) * grid_size))

            is_pred = pred_mask[i]
            is_gt = gt_mask[i]

            if is_pred and is_gt:
                grid[gy][gx] = "#"  # True Positive
            elif is_pred and not is_gt:
                grid[gy][gx] = "F"  # False Positive
            elif not is_pred and is_gt:
                grid[gy][gx] = "M"  # False Negative / Missed

        rows = []
        rows.append(f"+{'=' * grid_size}+")
        for row in reversed(grid):  # Y axis pointing up
            rows.append(f"|{''.join(row)}|")
        rows.append(f"+{'=' * grid_size}+")
        rows.append("Legend: '.'=Ground, '#'=True Positive, 'F'=False Positive, 'M'=Missed")

        return "\n".join(rows)

    @staticmethod
    def export_html_report(scene_results: List[Dict[str, Any]], output_path: str = "visual_debug_report.html"):
        """Exports standalone HTML visual report for failure inspection."""
        html_lines = [
            "<!DOCTYPE html>",
            "<html>",
            "<head><title>3D ULPIN Milestone 1.5 Visual Debug Report</title>",
            "<style>",
            "body { font-family: monospace; background: #121212; color: #e0e0e0; padding: 20px; }",
            "h1, h2 { color: #4caf50; }",
            ".scene-card { background: #1e1e1e; border: 1px solid #333; padding: 15px; margin-bottom: 20px; border-radius: 5px; }",
            ".ascii-box { background: #000; color: #00ff00; padding: 10px; font-family: courier, monospace; white-space: pre; }",
            ".metric-badge { display: inline-block; padding: 4px 8px; margin-right: 10px; background: #333; border-radius: 3px; }",
            ".fail { color: #ff5252; } .pass { color: #4caf50; }",
            "</style></head>",
            "<body>",
            "<h1>3D ULPIN AI/ML Engine — Milestone 1.5 Adversarial Validation</h1>",
            f"<p>Generated HTML Debug Report for {len(scene_results)} Scenes</p>"
        ]

        for s in scene_results:
            status_class = "fail" if s.get("verification_required", False) else "pass"
            html_lines.append(f"<div class='scene-card'>")
            html_lines.append(f"<h2>Scene: {s['scene_id']} | Difficulty: <span class='{status_class}'>{s['difficulty']}</span></h2>")
            html_lines.append(f"<div><span class='metric-badge'>Archetype: {s['archetype']}</span>")
            html_lines.append(f"<span class='metric-badge'>Height Error: {s['height_error_m']}m</span>")
            html_lines.append(f"<span class='metric-badge'>Building IoU: {s.get('building_iou', 0.0)}</span></div>")
            html_lines.append(f"<h3>Top-Down 2D Footprint Grid:</h3>")
            html_lines.append(f"<div class='ascii-box'>{s.get('ascii_grid', '')}</div>")
            html_lines.append(f"</div>")

        html_lines.append("</body></html>")

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(html_lines))
