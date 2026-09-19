import * as THREE from "three";
import { waypoints, CAM_Z_OFFSET_PORTRAIT } from "./waypoints";

export const N = waypoints.length; // 9

/** t parameter for waypoint i along the curves (parametrized by index). */
export function tForIndex(i: number): number {
  return N > 1 ? i / (N - 1) : 0;
}

export function indexForProgress(progress: number): number {
  return Math.round(progress * (N - 1));
}

export function camPosFor(wp: WaypointLike, portrait: boolean): [number, number, number] {
  const p: [number, number, number] = [...wp.camPos];
  if (portrait) p[2] += CAM_Z_OFFSET_PORTRAIT;
  return p;
}

type WaypointLike = { camPos: [number, number, number]; lookAt: [number, number, number] };

// Pre-allocated scratch vectors — reused every frame, never re-created.
export const tmpPos = new THREE.Vector3();
export const tmpLook = new THREE.Vector3();

// Curves through the CAM positions and the LOOK-AT positions, parametrized
// by waypoint index: waypoint i sits at t = i/(n-1).
export function buildCurves(portrait: boolean): {
  posCurve: THREE.CatmullRomCurve3;
  lookCurve: THREE.CatmullRomCurve3;
} {
  const pts = waypoints.map((w) => new THREE.Vector3(...camPosFor(w, portrait)));
  const looks = waypoints.map((w) => new THREE.Vector3(...w.lookAt));
  return {
    posCurve: new THREE.CatmullRomCurve3(pts, false, "centripetal"),
    lookCurve: new THREE.CatmullRomCurve3(looks, false, "centripetal"),
  };
}
