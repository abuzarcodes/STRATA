"""
api/main.py - FastAPI REST Microservice for AuraCadastre 3D.
Exposes REST endpoints for 3D ULPIN generation, CAD/GeoJSON extrusion, and topology audit.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
import os

# Add backend directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from coordinates import default_converter, GeodeticConverter
from ulpin_generator import ULPINGenerator
from extrusion_engine import extrusion_engine
from topology_validator import TopologyValidator
from generate_delhi_society_data import generate_cadastral_society_dataset

app = FastAPI(
    title="AuraCadastre 3D API",
    description="REST API for 3D ULPIN Generation, Volumetric Extrusion, and Cadastral Topology Auditing (SIH PS-011)",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExtrusionRequest(BaseModel):
    poly_2d: List[List[float]]
    z_min: float
    z_max: float
    base_ulpin: Optional[str] = "IND280145987621"
    unit_code: Optional[str] = "UNIT-NEW"
    domain: Optional[str] = "A"
    level: Optional[int] = 1


@app.get("/")
def root():
    return {
        "status": "online",
        "system": "AuraCadastre 3D API",
        "standards": ["ISO 19152 LADM Part 2", "OGC CityGML 3.0", "Bhu-Aadhaar 3D"],
        "endpoints": [
            "/api/v1/cadastre/delhi-society",
            "/api/v1/ulpin/generate",
            "/api/v1/geometry/extrude",
            "/api/v1/topology/audit"
        ]
    }


@app.get("/api/v1/cadastre/delhi-society")
def get_delhi_society_cadastre():
    """
    Returns the complete 3D Cadastral dataset for Aura Residency, Dwarka Sector 10.
    """
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "data", "cadastre_3d_registry.json"))
    if os.path.exists(dataset_path):
        import json
        with open(dataset_path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Cadastral registry not found. Run backend/pipeline.py first.")


@app.post("/api/v1/geometry/extrude")
def extrude_geometry(req: ExtrusionRequest):
    """
    Extrudes a 2D planar polygon into a 3D watertight polyhedron and generates its 3D-ULPIN.
    """
    try:
        poly_tuples = [(p[0], p[1]) for p in req.poly_2d]
        mesh_data = extrusion_engine.extrude_polygon_to_mesh(
            poly_2d=poly_tuples,
            z_min=req.z_min,
            z_max=req.z_max
        )

        ulpin_gen = ULPINGenerator(base_ulpin=req.base_ulpin)
        ulpin_record = ulpin_gen.generate_3d_ulpin(
            domain_flag=req.domain,
            floor_index=req.level,
            unit_code=req.unit_code,
            centroid=mesh_data["centroid_local"],
            bbox=mesh_data["bbox_local"]
        )

        result = {
            **mesh_data,
            **ulpin_record
        }
        del result["mesh_object"]
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
