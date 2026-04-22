"use client";

import { useEffect, useRef, useState } from "react";

function getCareerYears(): number {
  const now = new Date();
  const start = new Date(2022, 6, 1);
  return (
    Math.floor(
      (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    ) + 1
  );
}

const METRICS = [
  {
    target: getCareerYears(),
    suffix: "+",
    label: "Years\nExperience",
    context: "2022년 7월부터 현재까지",
  },
  {
    target: 7,
    suffix: "+",
    label: "Projects",
    context: "사내 서비스 · 개인 프로젝트",
  },
  {
    target: 3,
    suffix: "",
    label: "Open Source\nContributions",
    context: "TanStack Query 외 2건",
  },
  {
    target: 25,
    suffix: "+",
    label: "Tech Stack",
    context: "지속적으로 확장 중",
  },
];

function CountUp({
  target,
  suffix,
  active,
  delay,
}: {
  target: number;
  suffix: string;
  active: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const startTime = Date.now() + delay;
    let raf: number;

    const tick = () => {
      const now = Date.now();
      if (now < startTime) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 1200, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, delay]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="border-t border-gray-200 dark:border-gray-800"
      style={{ padding: "min(6rem, 12vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div className="grid grid-cols-2 tablet:grid-cols-4 max-w-[860px] mx-auto gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        {METRICS.map((m, i) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: hover exposes contextual text visually
          <div
            key={m.label}
            className="bg-gray-50 dark:bg-gray-900/60 text-center p-6 tablet:p-8 cursor-default select-none"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
              transitionDelay: `${i * 100}ms`,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="text-primary"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
                fontWeight: 800,
                lineHeight: 1,
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
                transition: "transform 0.2s ease",
                transform: hovered === i ? "scale(1.08)" : "scale(1)",
              }}
            >
              <CountUp
                target={m.target}
                suffix={m.suffix}
                active={visible}
                delay={i * 100}
              />
            </div>

            <div
              className="text-gray-500 dark:text-gray-400"
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                lineHeight: 1.4,
                whiteSpace: "pre-line",
                marginBottom: "0.5rem",
              }}
            >
              {m.label}
            </div>

            {/* Hover context */}
            <div
              className="text-primary overflow-hidden"
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                maxHeight: hovered === i ? "2rem" : "0",
                opacity: hovered === i ? 1 : 0,
                transition: "max-height 0.25s ease, opacity 0.25s ease",
              }}
            >
              {m.context}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
