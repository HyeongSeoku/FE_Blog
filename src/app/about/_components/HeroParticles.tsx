"use client";

import dynamic from "next/dynamic";

// Must match SAMPLE_W / SAMPLE_H in HeroParticlesScene
const ASPECT = `${900 / 506}`; // 16:9

const Scene = dynamic(
  () =>
    import("./HeroParticlesScene").then((m) => ({
      default: m.HeroParticlesScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: "100%", aspectRatio: ASPECT }} aria-hidden />
    ),
  },
);

export function HeroParticles() {
  return (
    <div
      className="ab-hero-particles"
      style={{ width: "100%", aspectRatio: ASPECT, position: "relative" }}
    >
      {/* particle canvas — z-index auto (below h1) */}
      <Scene />

      {/* full name as a real heading rendered on top of the particles */}
      <h1
        className="ab-hero-name"
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(1rem, 5.5vw, 4.2rem)",
          fontWeight: 800,
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-pretendard), system-ui, sans-serif",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        KIM HYEONG SEOK
      </h1>
    </div>
  );
}
