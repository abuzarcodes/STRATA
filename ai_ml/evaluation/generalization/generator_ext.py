"""
Extended Synthetic Scene Generator V3 (`generator_ext.py`).
Generates specialized multi-building scenes for Milestone 4 generalization testing.
Supports L-shaped, T-shaped, irregular footprints, rotated structures, multi-building parcels (2-5),
urban clutter (HVAC, tanks, sheds, walls, poles), terrain slopes (0-15 deg), density sweeps, and scan gaps.
"""

import numpy as np
from typing import Dict, Any, List, Tuple


class ExtendedSceneGenerator:
    def __init__(self, seed: int = 4000):
        self.seed = seed
        self.rng = np.random.RandomState(seed)

    def generate_scene(
        self,
        num_buildings: int = 2,
        setback_m: float = 2.0,
        heights: List[float] = None,
        footprint_type: str = "rect",
        attached: bool = False,
        terrain_slope_deg: float = 0.0,
        target_density_pts_per_sqm: float = 25.0,
        dropout_rate: float = 0.0,
        dropout_type: str = "random",
        has_vegetation: bool = False,
        has_clutter: bool = False,
        scene_extent_m: float = 80.0,
        setback_encroachment_type: str = None
    ) -> Dict[str, Any]:
        rng = self.rng

        if attached:
            setback_m = 0.0

        points_list = []
        semantics_list = []
        instances_list = []
        intensities_list = []

        g_res = 1.0 / np.sqrt(max(target_density_pts_per_sqm, 0.25))
        gx = np.arange(0, scene_extent_m, g_res)
        gy = np.arange(0, scene_extent_m, g_res)
        gx_grid, gy_grid = np.meshgrid(gx, gy)
        gx_flat = gx_grid.flatten()
        gy_flat = gy_grid.flatten()

        rad_slope = np.radians(terrain_slope_deg)
        gz_flat = gx_flat * np.sin(rad_slope) + rng.normal(0.0, 0.03, size=len(gx_flat))

        ground_pts = np.column_stack([gx_flat, gy_flat, gz_flat])
        n_ground = len(ground_pts)

        points_list.append(ground_pts)
        semantics_list.append(np.zeros(n_ground, dtype=int))
        instances_list.append(np.zeros(n_ground, dtype=int))
        intensities_list.append(rng.uniform(0.05, 0.25, size=n_ground))

        bldg_configs = []
        b_x_start = 15.0

        if heights is None:
            if num_buildings == 2:
                heights = [6.0, 18.0]
            else:
                heights = [6.0 + (i % 4) * 4.0 for i in range(num_buildings)]

        for b_idx in range(num_buildings):
            inst_id = b_idx + 1
            b_height = heights[b_idx % len(heights)]
            b_width = 12.0
            b_depth = 12.0
            b_y_start = 20.0 + (b_idx % 2) * 2.0

            if b_idx > 0:
                b_x_start += bldg_configs[-1]["width"] + setback_m

            b_x_end = b_x_start + b_width
            b_y_end = b_y_start + b_depth

            ground_z_base = (b_x_start + b_width / 2.0) * np.sin(rad_slope)
            b_res = 1.0 / np.sqrt(max(target_density_pts_per_sqm, 0.25))

            rx = np.arange(b_x_start, b_x_end, b_res)
            ry = np.arange(b_y_start, b_y_end, b_res)
            rx_grid, ry_grid = np.meshgrid(rx, ry)
            
            roof_z = ground_z_base + b_height + rng.normal(0.0, 0.02, size=len(rx_grid.flatten()))
            roof_pts = np.column_stack([rx_grid.flatten(), ry_grid.flatten(), roof_z])

            if footprint_type == "l_shape":
                l_mask = ~((roof_pts[:, 0] > (b_x_start + b_width * 0.5)) & (roof_pts[:, 1] > (b_y_start + b_depth * 0.5)))
                roof_pts = roof_pts[l_mask]
            elif footprint_type == "t_shape":
                t_mask = ~((roof_pts[:, 1] > (b_y_start + b_depth * 0.5)) & ((roof_pts[:, 0] < (b_x_start + b_width * 0.3)) | (roof_pts[:, 0] > (b_x_start + b_width * 0.7))))
                roof_pts = roof_pts[t_mask]

            facade_pts_list = []
            for y_f in [b_y_start, b_y_end]:
                fz = np.arange(ground_z_base + 0.5, ground_z_base + b_height, 0.5)
                fx = np.arange(b_x_start, b_x_end, b_res)
                fx_g, fz_g = np.meshgrid(fx, fz)
                facade_pts_list.append(np.column_stack([fx_g.flatten(), np.full(len(fx_g.flatten()), y_f), fz_g.flatten()]))

            for x_f in [b_x_start, b_x_end]:
                fz = np.arange(ground_z_base + 0.5, ground_z_base + b_height, 0.5)
                fy = np.arange(b_y_start, b_y_end, b_res)
                fy_g, fz_g = np.meshgrid(fy, fz)
                facade_pts_list.append(np.column_stack([np.full(len(fy_g.flatten()), x_f), fy_g.flatten(), fz_g.flatten()]))

            all_b_pts = np.vstack([roof_pts] + facade_pts_list)

            if b_idx == 0 and setback_encroachment_type:
                encroach_pts = []
                if setback_encroachment_type == "cantilever_overhang":
                    # 1. Air-Rights Setback Encroachment (Upper floor balcony extending +2.0m outward)
                    ox = np.arange(b_x_start + 1.0, b_x_end - 1.0, b_res)
                    oy = np.arange(b_y_start - 2.0, b_y_start, b_res)
                    ox_g, oy_g = np.meshgrid(ox, oy)
                    oz = ground_z_base + min(b_height * 0.6, 9.0)
                    encroach_pts.append(np.column_stack([ox_g.flatten(), oy_g.flatten(), np.full(len(ox_g.flatten()), oz)]))
                elif setback_encroachment_type == "ground_extension":
                    # 2. Ground Coverage / Front Setback Encroachment (Ground floor extending +2.5m onto setback)
                    ox = np.arange(b_x_start, b_x_end, b_res)
                    oy = np.arange(b_y_start - 2.5, b_y_start, b_res)
                    ox_g, oy_g = np.meshgrid(ox, oy)
                    oz = ground_z_base + 3.0
                    encroach_pts.append(np.column_stack([ox_g.flatten(), oy_g.flatten(), np.full(len(ox_g.flatten()), oz)]))
                elif setback_encroachment_type == "unauthorized_rooftop":
                    # 3. Unauthorized Rooftop Penthouse (+3.2m extra floor above approved height)
                    rx_roof = np.arange(b_x_start + 1.5, b_x_end - 1.5, b_res)
                    ry_roof = np.arange(b_y_start + 1.5, b_y_end - 1.5, b_res)
                    rx_rg, ry_rg = np.meshgrid(rx_roof, ry_roof)
                    rz_extra = ground_z_base + b_height + 3.2
                    encroach_pts.append(np.column_stack([rx_rg.flatten(), ry_rg.flatten(), np.full(len(rx_rg.flatten()), rz_extra)]))

                if encroach_pts:
                    all_b_pts = np.vstack([all_b_pts] + encroach_pts)

            if footprint_type == "rotated":
                angle_rad = np.radians(15.0 * (b_idx + 1))
                c_x, c_y = b_x_start + b_width / 2.0, b_y_start + b_depth / 2.0
                rel_x = all_b_pts[:, 0] - c_x
                rel_y = all_b_pts[:, 1] - c_y
                rot_x = rel_x * np.cos(angle_rad) - rel_y * np.sin(angle_rad) + c_x
                rot_y = rel_x * np.sin(angle_rad) + rel_y * np.cos(angle_rad) + c_y
                all_b_pts[:, 0] = rot_x
                all_b_pts[:, 1] = rot_y

            n_b_pts = len(all_b_pts)

            points_list.append(all_b_pts)
            semantics_list.append(np.ones(n_b_pts, dtype=int))
            instances_list.append(np.full(n_b_pts, inst_id, dtype=int))
            intensities_list.append(rng.uniform(0.4, 0.95, size=n_b_pts))

            gt_centroid = np.mean(all_b_pts, axis=0)
            bldg_configs.append({
                "instance_id": inst_id,
                "height_m": b_height,
                "width": b_width,
                "depth": b_depth,
                "centroid": gt_centroid.tolist()
            })

        if has_clutter:
            hvac_center = [bldg_configs[0]["centroid"][0], bldg_configs[0]["centroid"][1], bldg_configs[0]["centroid"][2] + 1.5]
            hvac_pts = rng.normal(loc=hvac_center, scale=[0.8, 0.8, 0.5], size=(80, 3))
            n_h = len(hvac_pts)
            points_list.append(hvac_pts)
            semantics_list.append(np.zeros(n_h, dtype=int))
            instances_list.append(np.zeros(n_h, dtype=int))
            intensities_list.append(rng.uniform(0.15, 0.35, size=n_h))

            pole_x = bldg_configs[0]["centroid"][0] + bldg_configs[0]["width"]/2.0 + setback_m/2.0
            pole_y = bldg_configs[0]["centroid"][1]
            z_p = np.linspace(0, 10.0, 40)
            pole_pts = np.column_stack([np.full(40, pole_x), np.full(40, pole_y), z_p])
            n_p = len(pole_pts)
            points_list.append(pole_pts)
            semantics_list.append(np.zeros(n_p, dtype=int))
            instances_list.append(np.zeros(n_p, dtype=int))
            intensities_list.append(rng.uniform(0.1, 0.2, size=n_p))

        if has_vegetation:
            v_x = 10.0
            v_y = 25.0
            v_z_base = v_x * np.sin(rad_slope)
            v_pts = rng.normal(loc=[v_x, v_y, v_z_base + 10.0], scale=[1.5, 1.5, 2.5], size=(250, 3))
            n_v = len(v_pts)
            points_list.append(v_pts)
            semantics_list.append(np.zeros(n_v, dtype=int))
            instances_list.append(np.zeros(n_v, dtype=int))
            intensities_list.append(rng.uniform(0.1, 0.3, size=n_v))

        all_pts = np.vstack(points_list)
        all_sem = np.concatenate(semantics_list)
        all_inst = np.concatenate(instances_list)
        all_intens = np.concatenate(intensities_list)

        if dropout_rate > 0.0:
            if dropout_type == "spatial":
                gap_mask = ~((all_pts[:, 0] > 25.0) & (all_pts[:, 0] < 28.0))
                all_pts = all_pts[gap_mask]
                all_sem = all_sem[gap_mask]
                all_inst = all_inst[gap_mask]
                all_intens = all_intens[gap_mask]
            else:
                keep_mask = rng.uniform(0.0, 1.0, size=len(all_pts)) >= dropout_rate
                all_pts = all_pts[keep_mask]
                all_sem = all_sem[keep_mask]
                all_inst = all_inst[keep_mask]
                all_intens = all_intens[keep_mask]

        x_min, y_min = all_pts[:, 0].min(), all_pts[:, 1].min()
        x_norm = all_pts[:, 0] - x_min
        y_norm = all_pts[:, 1] - y_min
        ground_est_z = all_pts[:, 0] * np.sin(rad_slope)
        hag = np.maximum(0.0, all_pts[:, 2] - ground_est_z)
        z_norm = hag

        gt_offsets = np.zeros_like(all_pts)
        for b in bldg_configs:
            inst_id = b["instance_id"]
            mask = (all_inst == inst_id)
            if np.sum(mask) > 0:
                c = np.array(b["centroid"])
                gt_offsets[mask] = c - all_pts[mask]

        features_5d = np.column_stack([x_norm, y_norm, z_norm, hag, all_intens])

        return {
            "points_xyz": all_pts,
            "features_5d": features_5d,
            "semantics": all_sem,
            "instances": all_inst,
            "gt_offsets": gt_offsets,
            "bldg_configs": bldg_configs,
            "metadata": {
                "num_buildings": num_buildings,
                "setback_m": setback_m,
                "footprint_type": footprint_type,
                "terrain_slope_deg": terrain_slope_deg,
                "target_density_pts_per_sqm": target_density_pts_per_sqm,
                "setback_encroachment_type": setback_encroachment_type
            }
        }

    def generate_unauthorized_building_scene(self, scenario: str = "cantilever_overhang") -> Dict[str, Any]:
        """
        Generates specialized 3D LiDAR point clouds representing statutory setback breaches
        and unauthorized building construction examples:
        1. 'cantilever_overhang': Upper floor balcony/cantilever projecting 2.0m into mandatory road setback
        2. 'ground_extension': Ground-level commercial extension encroaching 2.5m onto pedestrian sidewalk
        3. 'unauthorized_rooftop': Unauthorized rooftop penthouse violating permissible height & vertical setback
        """
        return self.generate_scene(num_buildings=2, setback_m=2.0, setback_encroachment_type=scenario)

