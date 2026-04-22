"use client";

import { useState } from "react";
import { FadeInSection } from "./FadeInSection";

const SKILL_CATEGORIES = [
  {
    label: "Core",
    skills: ["React", "TypeScript", "Next.js", "JavaScript (ES6+)"],
  },
  {
    label: "Styling & UI",
    skills: ["Tailwind CSS", "Radix UI", "Sass"],
  },
  {
    label: "Testing",
    skills: ["Playwright (VRT)", "Vitest", "Jest", "RTL"],
  },
  {
    label: "DevOps & Infra",
    skills: ["GitHub Actions", "Nginx", "Docker"],
  },
  {
    label: "Media",
    skills: ["HLS.js", "MSE (Media Source Extensions)"],
  },
  {
    label: "Tools",
    skills: [
      "Figma",
      "Storybook",
      "Nexus",
      "Webpack",
      "Vite",
      "Husky",
      "ESLint",
      "Prettier",
      "Biome",
    ],
  },
];

function SkillCard({
  label,
  skills,
  delay,
}: {
  label: string;
  skills: string[];
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeInSection delay={delay}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: purely decorative hover effect */}
      <div
        className="h-full p-5 tablet:p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-white/[0.02] transition-all duration-300"
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: hovered ? "var(--primary-color)" : "transparent",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h3
          className="text-sm font-semibold mb-4 tracking-wide transition-colors duration-200"
          style={{
            color: hovered ? "var(--primary-color)" : undefined,
          }}
        >
          {label}
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              style={{
                border: hovered
                  ? "1px solid rgba(10,186,181,0.35)"
                  : "1px solid",
                borderColor: hovered ? "rgba(10,186,181,0.35)" : undefined,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}

export function Skills() {
  return (
    <section
      id="SKILL"
      className="scroll-mt-20"
      style={{ padding: "min(10rem, 16vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div className="max-w-[860px] mx-auto">
        {/* Section header */}
        <FadeInSection className="mb-12">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Skills
          </p>
          <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900 dark:text-white">
            기술 스택
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm tablet:text-base leading-relaxed">
            프론트엔드를 중심으로, 미디어·인프라·테스트 영역까지 역량을 넓혀가고
            있습니다.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-5">
          {SKILL_CATEGORIES.map((cat, i) => (
            <SkillCard
              key={cat.label}
              label={cat.label}
              skills={cat.skills}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
