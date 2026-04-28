"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const TEXT = "KHS";
const SAMPLE_W = 900;
const SAMPLE_H = 506; // 16:9
const SPAN_X = 1.8;
const SPAN_Y = SPAN_X * (SAMPLE_H / SAMPLE_W);
const GAP = 9;

// Amplitude in world units.
// At zoom ≈ 440 (900 px viewport): 0.004 wu ≈ 1.8 px
// At zoom ≈ 200 (400 px viewport): 0.004 wu ≈ 0.8 px  — always ≤ 2 px
const FLOAT_AMP = 0.004;

function sampleText(): Float32Array {
  const oc = document.createElement("canvas");
  oc.width = SAMPLE_W;
  oc.height = SAMPLE_H;
  const ctx = oc.getContext("2d");
  if (!ctx) return new Float32Array();

  // Scale font to fill available space in both axes
  let fs = SAMPLE_H * 0.82;
  ctx.font = `bold ${fs}px "Courier New", Courier, monospace`;
  const textW = ctx.measureText(TEXT).width;
  const maxByWidth = (fs * SAMPLE_W * 0.9) / textW;
  fs = Math.min(fs, maxByWidth);

  ctx.font = `bold ${fs}px "Courier New", Courier, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(TEXT, SAMPLE_W / 2, SAMPLE_H / 2);

  const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);
  const positions: number[] = [];

  for (let y = 0; y < SAMPLE_H; y += GAP) {
    for (let x = 0; x < SAMPLE_W; x += GAP) {
      if (data[(y * SAMPLE_W + x) * 4 + 3] > 60) {
        positions.push(
          (x / SAMPLE_W - 0.5) * SPAN_X,
          -(y / SAMPLE_H - 0.5) * SPAN_Y,
          0,
        );
      }
    }
  }

  return new Float32Array(positions);
}

// ── GLSL ──────────────────────────────────────────────────────────────────────

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2  uMouse;
attribute float aSize;
attribute float aPhase;
varying float vEntered; // pass to fragment for opacity fade

void main() {
  vec3 pos = position;

  // Wave entrance: left→right stagger
  float wave   = (position.x / ${SPAN_X} + 0.5) * 0.55;
  float localP = clamp((uProgress - wave) / 0.45, 0.0, 1.0);
  float entered = localP * localP * (3.0 - 2.0 * localP);
  vEntered = entered;

  // Subtle rise: only 0.04 world units (~18px) — barely noticeable lift
  pos.y += (1.0 - entered) * -0.04;

  // Micro-oscillation
  pos.x += sin(uTime * 1.5 + aPhase)        * ${FLOAT_AMP} * entered;
  pos.y += cos(uTime * 1.2 + aPhase + 0.83) * ${FLOAT_AMP} * entered;

  // Gentle mouse nudge
  vec2 d    = pos.xy - uMouse;
  float dist = length(d);
  if (dist < 0.2 && dist > 0.0001) {
    pos.xy += normalize(d) * (1.0 - dist / 0.2) * 0.022 * entered;
  }

  gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize;
}
`;

// Glow is achieved in-shader via bright core + soft falloff + AdditiveBlending.
// No EffectComposer needed → canvas stays fully transparent (no dark rectangle).
const fragmentShader = `
varying float vEntered;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r  = length(uv) * 2.0;
  if (r > 1.0) discard;

  float core = pow(1.0 - smoothstep(0.0, 0.5, r), 1.5);
  float halo = 1.0 - smoothstep(0.0, 1.0, r);
  float a    = (core * 0.72 + halo * 0.18) * vEntered; // fade in with entrance

  gl_FragColor = vec4(0.039, 0.729, 0.710, a);
}
`;

// ── Components ────────────────────────────────────────────────────────────────

function AdaptiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = (size.width / SPAN_X) * 0.88;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
}

function ParticleMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouseWorld = useRef(new THREE.Vector2(-999, -999));
  const { camera, gl } = useThree();

  const geometry = useMemo(() => {
    const positions = sampleText();
    const count = positions.length / 3;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = 11.0 + Math.random() * 6.0; // 11–17 px
      phases[i] = Math.random() * Math.PI * 2;
    }
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(-999, -999) },
    }),
    [],
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector3(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
        0,
      );
      ndc.unproject(camera);
      mouseWorld.current.set(ndc.x, ndc.y);
    };
    const onLeave = () => mouseWorld.current.set(-999, -999);

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [camera, gl]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Record mount time synchronously so elapsed starts from 0 on the very first frame
  const mountTime = useRef(performance.now());

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const elapsed = (performance.now() - mountTime.current) / 1000;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uProgress.value = Math.min(elapsed / 1.8, 1.0);
    matRef.current.uniforms.uMouse.value.copy(mouseWorld.current);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroParticlesScene() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 300, position: [0, 0, 1], near: 0.01, far: 10 }}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent", display: "block" }}
    >
      <AdaptiveCamera />
      <ParticleMesh />
    </Canvas>
  );
}
