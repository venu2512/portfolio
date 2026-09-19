"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { useSiteStore } from "../lib/store";
import { scrollState } from "../lib/scroll";
import { CAM_Z_OFFSET_PORTRAIT } from "./waypoints";
import {
  buildCurves,
  indexForProgress,
  tmpPos as tmpTargetPos,
  tmpLook as tmpTargetLook,
} from "./rail";

export default function CameraRig() {
  const progress = useRef(0);
  const lastActive = useRef(0);
  const camPos = useRef(new THREE.Vector3(0, 2.2, 34));
  const camLook = useRef(new THREE.Vector3(0, 1.5, 0));
  const portraitRef = useRef(false);
  const size = useThree((s) => s.size);

  const { posCurve, lookCurve } = useMemo(() => buildCurves(false), []);

  const setActive = useSiteStore((s) => s.set);

  // FOV: 55 desktop, 65 portrait; portrait also pulls the rig back +2 Z.
  // Applied inside useFrame to avoid mutating the store camera during render.
  useEffect(() => {
    portraitRef.current = size.width / size.height < 1;
  }, [size]);

  useFrame((state, dt) => {
    const { reducedMotion } = useSiteStore.getState();
    const camera = state.camera as THREE.PerspectiveCamera;

    // FOV by orientation (55 desktop / 65 portrait) — cheap, checked per frame.
    const targetFov = portraitRef.current ? 65 : 55;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }

    // Damped progress 0..1 toward the native scroll target.
    const lambda = reducedMotion ? 50 : 3.5;
    progress.current = THREE.MathUtils.damp(progress.current, scrollState.progress, lambda, dt);
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    posCurve.getPoint(p, tmpTargetPos);
    lookCurve.getPoint(p, tmpTargetLook);

    // Buttery vector damping on top of scalar damping.
    const smoothTime = reducedMotion ? 0.02 : 0.3;
    damp3(camPos.current, tmpTargetPos, smoothTime, dt);
    damp3(camLook.current, tmpTargetLook, smoothTime, dt);

    camera.position.copy(camPos.current);
    if (portraitRef.current) camera.position.z += CAM_Z_OFFSET_PORTRAIT;

    // Pointer parallax (max ±0.6), disabled in portrait + reduced motion.
    if (!reducedMotion && !portraitRef.current) {
      camera.position.x += state.pointer.x * 0.6;
      camera.position.y += state.pointer.y * 0.3;
    }

    camera.lookAt(camLook.current);

    // Active section: nearest waypoint (write to store only on change).
    const idx = indexForProgress(p);
    if (idx !== lastActive.current) {
      lastActive.current = idx;
      setActive("active", idx);
    }
  });

  return null;
}
