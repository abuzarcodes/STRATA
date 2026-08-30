"""
Noise & Failure Scenario Engine for Synthetic Point Clouds.
Injects 9 realistic negative scenarios to evaluate robustness against real-world urban complexity:
1. Tree Canopy Overhang
2. Rooftop Appurtenances (HVAC, Water Tanks)
3. Attached Buildings
4. Boundary Walls
5. Sheds & Temporary Structures
6. Parked Vehicles / Cars
7. Utility Poles & Lines
8. Point Density Drop / Degradation
9. Missing / Partial Scans (Occlusions)
"""

from typing import Tuple, List, Dict
import numpy as np


class NoiseScenarioEngine:
    """
    Applies synthetic failure scenarios and noise degradations to clean point clouds.
    """

    def __init__(self, seed: int = 42):
        self.rng = np.random.default_rng(seed)

    def apply_scenarios(
        self,
        points: np.ndarray,
        scenarios: List[str]
    ) -> Tuple[np.ndarray, List[str]]:
        """
        Applies requested failure scenarios to input points Nx6: [X, Y, Z, Intensity, ReturnNum, Classification]
        Returns (degraded_points, applied_scenario_names)
        """
        modified_pts = points.copy()
        applied: List[str] = []

        for scenario in scenarios:
            if scenario == "tree_canopy_overhang":
                modified_pts = self._inject_tree_canopy(modified_pts)
                applied.append(scenario)
            elif scenario == "rooftop_appurtenances":
                modified_pts = self._inject_rooftop_appurtenances(modified_pts)
                applied.append(scenario)
            elif scenario == "boundary_walls":
                modified_pts = self._inject_boundary_walls(modified_pts)
                applied.append(scenario)
            elif scenario == "sheds_temporary":
                modified_pts = self._inject_sheds(modified_pts)
                applied.append(scenario)
            elif scenario == "cars_vehicles":
                modified_pts = self._inject_cars(modified_pts)
                applied.append(scenario)
            elif scenario == "utility_poles":
                modified_pts = self._inject_utility_poles(modified_pts)
                applied.append(scenario)
            elif scenario == "density_degradation":
                modified_pts = self._apply_density_degradation(modified_pts)
                applied.append(scenario)
            elif scenario == "missing_partial_scans":
                modified_pts = self._apply_missing_scans(modified_pts)
                applied.append(scenario)

        return modified_pts, applied

    def _inject_tree_canopy(self, pts: np.ndarray) -> np.ndarray:
        """Injects tree points (Class 5) overhanging roof edges."""
        # Find max roof bounds
        b_mask = pts[:, 5] == 6
        if not np.any(b_mask):
            return pts

        b_pts = pts[b_mask]
        x_min, x_max = b_pts[:, 0].min(), b_pts[:, 0].max()
        y_min, y_max = b_pts[:, 1].min(), b_pts[:, 1].max()
        max_z = b_pts[:, 2].max()

        num_tree_pts = 300
        # Dome-shaped tree canopy near corner
        tx = self.rng.normal(x_min, 3.0, num_tree_pts)
        ty = self.rng.normal(y_min, 3.0, num_tree_pts)
        tz = self.rng.normal(max_z + 1.5, 1.5, num_tree_pts).clip(1.0, max_z + 4.0)
        t_int = self.rng.normal(40, 10, num_tree_pts).clip(10, 100)
        t_ret = self.rng.choice([1, 2, 3], num_tree_pts)  # multiple returns for vegetation
        t_class = np.full(num_tree_pts, 5)  # 5 = High Vegetation

        tree_pts = np.column_stack([tx, ty, tz, t_int, t_ret, t_class])
        return np.vstack([pts, tree_pts])

    def _inject_rooftop_appurtenances(self, pts: np.ndarray) -> np.ndarray:
        """Injects high Z rooftop water tanks / HVAC units (Class 6)."""
        b_mask = pts[:, 5] == 6
        if not np.any(b_mask):
            return pts

        b_pts = pts[b_mask]
        center_x = (b_pts[:, 0].min() + b_pts[:, 0].max()) / 2
        center_y = (b_pts[:, 1].min() + b_pts[:, 1].max()) / 2
        max_z = b_pts[:, 2].max()

        # Water tank cylinder (height +2.5m above roof)
        num_tank = 150
        theta = self.rng.uniform(0, 2 * np.pi, num_tank)
        r = self.rng.uniform(0, 1.5, num_tank)
        hx = center_x + r * np.cos(theta)
        hy = center_y + r * np.sin(theta)
        hz = self.rng.uniform(max_z, max_z + 2.5, num_tank)
        h_int = self.rng.normal(200, 10, num_tank).clip(100, 255)
        h_ret = np.ones(num_tank, dtype=int)
        h_class = np.full(num_tank, 6)

        tank_pts = np.column_stack([hx, hy, hz, h_int, h_ret, h_class])
        return np.vstack([pts, tank_pts])

    def _inject_boundary_walls(self, pts: np.ndarray) -> np.ndarray:
        """Injects thin 1.8m boundary walls (Class 1) around perimeter."""
        num_wall = 200
        wx = self.rng.uniform(1.0, 49.0, num_wall)
        wy = np.where(self.rng.random(num_wall) > 0.5, 1.0, 49.0)
        wz = self.rng.uniform(0.0, 1.8, num_wall)
        w_int = self.rng.normal(100, 15, num_wall).clip(30, 200)
        w_ret = np.ones(num_wall, dtype=int)
        w_class = np.full(num_wall, 1)

        wall_pts = np.column_stack([wx, wy, wz, w_int, w_ret, w_class])
        return np.vstack([pts, wall_pts])

    def _inject_sheds(self, pts: np.ndarray) -> np.ndarray:
        """Injects low temporary shed (height 2.0m)."""
        num_shed = 150
        sx = self.rng.uniform(2.0, 7.0, num_shed)
        sy = self.rng.uniform(2.0, 7.0, num_shed)
        sz = self.rng.uniform(0.0, 2.1, num_shed)
        s_int = self.rng.normal(80, 10, num_shed).clip(20, 150)
        s_ret = np.ones(num_shed, dtype=int)
        s_class = np.full(num_shed, 1)

        shed_pts = np.column_stack([sx, sy, sz, s_int, s_ret, s_class])
        return np.vstack([pts, shed_pts])

    def _inject_cars(self, pts: np.ndarray) -> np.ndarray:
        """Injects parked cars on ground (height 1.4m)."""
        num_car = 100
        cx = self.rng.uniform(5.0, 9.0, num_car)
        cy = self.rng.uniform(40.0, 44.0, num_car)
        cz = self.rng.uniform(0.0, 1.4, num_car)
        c_int = self.rng.normal(160, 20, num_car).clip(50, 255)
        c_ret = np.ones(num_car, dtype=int)
        c_class = np.full(num_car, 1)

        car_pts = np.column_stack([cx, cy, cz, c_int, c_ret, c_class])
        return np.vstack([pts, car_pts])

    def _inject_utility_poles(self, pts: np.ndarray) -> np.ndarray:
        """Injects narrow 8.0m utility pole."""
        num_pole = 80
        px = np.full(num_pole, 3.0) + self.rng.normal(0, 0.1, num_pole)
        py = np.full(num_pole, 25.0) + self.rng.normal(0, 0.1, num_pole)
        pz = self.rng.uniform(0.0, 8.0, num_pole)
        p_int = self.rng.normal(210, 10, num_pole).clip(100, 255)
        p_ret = np.ones(num_pole, dtype=int)
        p_class = np.full(num_pole, 1)

        pole_pts = np.column_stack([px, py, pz, p_int, p_ret, p_class])
        return np.vstack([pts, pole_pts])

    def _apply_density_degradation(self, pts: np.ndarray) -> np.ndarray:
        """Randomly drops 50% of points to simulate low point density."""
        keep_mask = self.rng.random(len(pts)) > 0.5
        return pts[keep_mask]

    def _apply_missing_scans(self, pts: np.ndarray) -> np.ndarray:
        """Simulates occluded/missing scan region in top right corner."""
        keep_mask = ~((pts[:, 0] > 35.0) & (pts[:, 1] > 35.0))
        return pts[keep_mask]
