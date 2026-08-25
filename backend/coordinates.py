"""
coordinates.py - Geodetic and Local Topocentric Coordinate Reference System (CRS) transformations.
Handles conversions between WGS84 (EPSG:4326), UTM Zone 43N (EPSG:32643 - North India / Delhi),
and Local Metric CAD relative coordinates.
"""

import math
from typing import Tuple, List

try:
    import pyproj
    HAS_PYPROJ = True
    # WGS84 to UTM Zone 43N (Delhi NCR)
    _transformer_to_utm = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:32643", always_xy=True)
    _transformer_to_wgs = pyproj.Transformer.from_crs("EPSG:32643", "EPSG:4326", always_xy=True)
except Exception:
    HAS_PYPROJ = False

# Anchor coordinate for Delhi NCR (Dwarka Sector 10 / Delhi Society Anchor)
DEFAULT_ORIGIN_LAT = 28.582300
DEFAULT_ORIGIN_LON = 77.060200
DEFAULT_ORIGIN_ALT = 215.0  # Mean Sea Level (MSL) in meters

# Earth constants for topocentric fallback approximation
WGS84_A = 6378137.0  # Semi-major axis
WGS84_F = 1.0 / 298.257223563
WGS84_B = WGS84_A * (1.0 - WGS84_F)


class GeodeticConverter:
    def __init__(self, origin_lat: float = DEFAULT_ORIGIN_LAT, origin_lon: float = DEFAULT_ORIGIN_LON, origin_alt: float = DEFAULT_ORIGIN_ALT):
        self.origin_lat = origin_lat
        self.origin_lon = origin_lon
        self.origin_alt = origin_alt
        
        # Calculate meters per degree around origin
        lat_rad = math.radians(origin_lat)
        self.meters_per_lat_deg = 111132.954 - 559.822 * math.cos(2 * lat_rad) + 1.175 * math.cos(4 * lat_rad)
        self.meters_per_lon_deg = (math.pi / 180.0) * WGS84_A * math.cos(lat_rad) / math.sqrt(1.0 - (1.0 - (WGS84_B/WGS84_A)**2) * (math.sin(lat_rad)**2))

    def local_meters_to_wgs84(self, x_m: float, y_m: float, z_m: float = 0.0) -> Tuple[float, float, float]:
        """
        Converts local CAD topocentric coordinates (East=x, North=y in meters)
        relative to the origin to WGS84 (Lon, Lat, Alt_MSL).
        """
        d_lat = y_m / self.meters_per_lat_deg
        d_lon = x_m / self.meters_per_lon_deg
        
        lon = self.origin_lon + d_lon
        lat = self.origin_lat + d_lat
        alt = self.origin_alt + z_m
        return round(lon, 7), round(lat, 7), round(alt, 2)

    def wgs84_to_local_meters(self, lon: float, lat: float, alt: float = 0.0) -> Tuple[float, float, float]:
        """
        Converts WGS84 (Lon, Lat, Alt_MSL) to local CAD topocentric meters (x, y, z).
        """
        d_lat = lat - self.origin_lat
        d_lon = lon - self.origin_lon
        
        x_m = d_lon * self.meters_per_lon_deg
        y_m = d_lat * self.meters_per_lat_deg
        z_m = alt - self.origin_alt if alt != 0.0 else 0.0
        return round(x_m, 3), round(y_m, 3), round(z_m, 3)

    def transform_polygon_to_wgs84(self, local_polygon_2d: List[Tuple[float, float]], z_m: float = 0.0) -> List[List[float]]:
        """
        Transforms a 2D local polygon [(x, y), ...] at elevation z_m into GeoJSON WGS84 coordinate ring [[lon, lat, alt], ...]
        """
        coords = []
        for pt in local_polygon_2d:
            lon, lat, alt = self.local_meters_to_wgs84(pt[0], pt[1], z_m)
            coords.append([lon, lat, alt])
        # Ensure closed ring
        if coords and coords[0] != coords[-1]:
            coords.append(coords[0])
        return coords


# Singleton default converter
default_converter = GeodeticConverter()
