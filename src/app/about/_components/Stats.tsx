"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";
import { getCareerYears } from "../utils";

const METRICS = [
  {
    target: getCareerYears(),
    suffix: "+",
    label: "Years Experience",
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
    label: "Open Source",
    context: "TanStack Query 외 2건",
  },
  {
    target: 25,
    suffix: "+",
    label: "Tech Stack",
    context: "지속적으로 확장 중",
  },
];

// 40-item repeating column (0-9 × 4): 3 full rotations + final digit = index 30..39
const SLOT_COLUMN = Array.from({ length: 40 }, (_, i) => i % 10);
const SPIN_ROUNDS = 3;
const SLOT_DURATION = 1400; // ms

function SlotDigit({
  digit,
  active,
  delay,
}: {
  digit: number;
  active: boolean;
  delay: number;
}) {
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setRolling(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  // translateY(-finalIndex * 1em) shows the correct digit through the 1em viewport
  const finalIndex = SPIN_ROUNDS * 10 + digit;

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        height: "1em",
        verticalAlign: "top",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1,
          transform: rolling ? `translateY(-${finalIndex}em)` : "translateY(0)",
          transition: rolling
            ? `transform ${SLOT_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
            : "none",
          willChange: "transform",
        }}
      >
        {SLOT_COLUMN.map((d, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length repeating column
            key={i}
            style={{ display: "block", textAlign: "center" }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function SlotNumber({
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
  const digits = target.toString().split("").map(Number);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {digits.map((d, i) => (
        <SlotDigit
          // biome-ignore lint/suspicious/noArrayIndexKey: digit position is stable for a fixed number
          key={i}
          digit={d}
          active={active}
          delay={delay + i * 80}
        />
      ))}
      {/* suffix fades in just as the last digit settles */}
      <span
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.35s ease ${delay + digits.length * 80 + SLOT_DURATION - 150}ms`,
        }}
      >
        {suffix}
      </span>
    </span>
  );
}

export function Stats() {
  const { ref, isIntersecting: visible } =
    useIntersectionObserver<HTMLElement>(0.3);

  return (
    <section
      ref={ref}
      className="border-t border-gray-200 dark:border-gray-800"
      style={{ padding: "min(6rem, 12vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div className="grid grid-cols-2 tablet:grid-cols-4 max-w-[860px] mx-auto gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            className="ab-stat-cell bg-gray-50 dark:bg-gray-900/60 text-center p-6 tablet:p-8 cursor-default select-none"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <div
              className="ab-stat-number text-primary"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
                fontWeight: 800,
                lineHeight: 1,
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              <SlotNumber
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
                marginBottom: "0.5rem",
              }}
            >
              {m.label}
            </div>

            <div className="ab-stat-context text-primary">{m.context}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
