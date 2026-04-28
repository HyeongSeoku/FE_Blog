"use client";

import { useEffect, useState } from "react";
import { HeroParticles } from "./HeroParticles";

const PHRASES = [
  "복잡한 문제를 명확하고 빠른 웹 경험으로 변환합니다",
  "레거시를 현대 기술 스택으로 전환하는 일을 즐깁니다",
  "코드와 사용자 경험 사이의 교차점을 탐구합니다",
];

const MARQUEE_ITEMS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Playwright",
  "HLS.js",
  "Docker",
  "GitHub Actions",
  "Tailwind CSS",
];

function getCareerYears(): number {
  const now = new Date();
  const start = new Date(2022, 6, 1);
  return (
    Math.floor(
      (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    ) + 1
  );
}

export function Hero() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < phrase.length) {
        timer = setTimeout(
          () => setDisplayed(phrase.slice(0, displayed.length + 1)),
          38,
        );
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 18);
      } else {
        setIsDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, phraseIdx]);

  const marqueeContent = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  const careerYears = getCareerYears();

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Atmospheric teal glow ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(70vw, 700px)",
          height: "min(70vw, 700px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(10,186,181,0.06) 0%, transparent 68%)",
          filter: "blur(32px)",
        }}
      />

      {/* ── Main content ── */}
      <div
        className="relative z-10 text-center w-full"
        style={{
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          maxWidth: "900px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
      >
        {/* Role badge */}
        <p
          className="text-primary mb-5 tracking-widest uppercase"
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
          }}
        >
          Frontend Developer · {careerYears}년차
        </p>

        <div style={{ margin: "0 0 1.75rem" }}>
          <HeroParticles />
        </div>

        {/* Teal accent underline */}
        <div
          style={{
            width: "3.5rem",
            height: "3px",
            background: "var(--primary-color)",
            borderRadius: "2px",
            margin: "0 auto 2.5rem",
          }}
        />

        {/* Typing animation */}
        <div
          className="text-gray-500 dark:text-gray-400"
          style={{
            fontSize: "clamp(0.925rem, 2vw, 1.1rem)",
            minHeight: "1.7em",
            lineHeight: 1.7,
          }}
        >
          <span>{displayed}</span>
          <span className="ab-blink text-primary">|</span>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div
        className="absolute left-0 right-0 overflow-hidden border-t border-b border-gray-200 dark:border-gray-800"
        style={{ bottom: "2rem", padding: "0.625rem 0" }}
      >
        <div className="ab-marquee-track">
          {marqueeContent.map((item, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: duplicated items — index is intentional
              key={i}
              className="text-gray-400 dark:text-gray-600"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                padding: "0 1.75rem",
                whiteSpace: "nowrap",
              }}
            >
              {item}&nbsp;&nbsp;·
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
