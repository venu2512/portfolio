"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import { useSiteStore, effectiveTier, stepTier, tierValue } from "../lib/store";
import { tierTables } from "../lib/quality";
import { waypoints } from "./waypoints";
import { buildCurves } from "./rail";

import Hero from "./stations/Hero";
import About from "./stations/About";
import Kreupai from "./stations/Kreupai";
import Quadedutor from "./stations/Quadedutor";
import Nitroware from "./stations/Nitroware";
import Skills from "./stations/Skills";
import Projects from "./stations/Projects";
import Education from "./stations/Education";
import Contact from "./stations/Contact";

export default function Scene({ onReady }: { onReady: () => void }) {
  const simpleView = useSiteStore((s) => s.simpleView);
  const tierOverride = useSiteStore((s) => s.tierOverride);
  const runtimeTier = useSiteStore((s) => s.runtimeTier);
  const detectedTier = useSiteStore((s) => s.detectedTier);
  const tier = effectiveTier(tierOverride, runtimeTier, detectedTier, simpleView);
  const tables = tierTables(tier);

  // Pause the render loop when the tab is hidden.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const handleContextLost = useMemo(() => {
    return () => {
      let restored = false;
      const onRestore = () => {
        restored = true;
      };
      window.addEventListener("webglcontextrestored", onRestore, { once: true });
      window.setTimeout(() => {
        if (!restored) useSiteStore.getState().set("webgl", "lost");
      }, 2000);
    };
  }, []);

  return (
    <Canvas
      camera={{ fov: 55, position: [0, 2.2, 34], near: 0.1, far: 240 }}
      dpr={tables.dpr}
      frameloop={hidden ? "never" : "always"}
      gl={{
        antialias: tables.antialias,
        alpha: false,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#05060d"), 1);
        onReady();
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          handleContextLost();
        });
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => {
          const s = useSiteStore.getState();
          if (s.tierOverride === "auto") s.set("runtimeTier", stepTier(s.runtimeTier, -1));
        }}
        onIncline={() => {
          const s = useSiteStore.getState();
          if (s.tierOverride !== "auto") return;
          const next = stepTier(s.runtimeTier, 1);
          if (tierValue(next) <= tierValue(s.detectedTier)) s.set("runtimeTier", next);
        }}
      />

      <color attach="background" args={["#05060d"]} />
      <fog attach="fog" args={["#05060d", 20, 80]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[12, 24, 8]} intensity={0.7} />
      <pointLight position={[-10, 6, -40]} intensity={40} color="#8b5cf6" distance={60} decay={2} />

      <CameraRig />
      <RailLine />

      <Hero />
      <About />
      <Kreupai />
      <Quadedutor />
      <Nitroware />
      <Skills />
      <Projects />
      <Education />
      <Contact />

      <Effects />
    </Canvas>
  );
}

/** The glowing camera rail through the corridor. */
function RailLine() {
  const { posCurve } = useMemo(() => buildCurves(false), []);
  const points = useMemo(() => posCurve.getPoints(220), [posCurve]);

  useEffect(() => {
    return () => {
      points.length = 0; // help GC; geometry disposed by drei Line on unmount
    };
  }, [points]);

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.28} toneMapped={false} />
      </line>
      {waypoints.map((w) => (
        <mesh key={w.id} position={w.station}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
