"""
Full 3D Candidate Property Hierarchy JSON Exporter (`json_exporter.py`).
"""

import json
from pathlib import Path
from typing import Dict, Any

class JSONExporter:
    @staticmethod
    def export_json(data: Dict[str, Any], output_path: Path) -> str:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        content = json.dumps(data, indent=2)
        output_path.write_text(content, encoding="utf-8")
        return str(output_path)
