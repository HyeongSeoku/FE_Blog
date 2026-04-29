"use client";

import { FadeInSection } from "./FadeInSection";
import { ExternalIcon } from "./icons";
import { TiltCard } from "./TiltCard";

interface Project {
  name: string;
  url: string;
  description: string;
  techStack: string[];
  period: string;
  githubUrl?: string;
}

const PROJECTS: Project[] = [
  {
    name: "sseoku.com",
    url: "https://sseoku.com",
    description:
      "Next.js 14, TypeScript로 직접 구축 및 운영하는 개인 블로그입니다. 학습한 내용과 트러블 슈팅 과정을 꾸준히 기록하고 있습니다.",
    techStack: ["Next.js 14", "TypeScript", "GitHub Actions", "Husky"],
    period: "2024.08 ~ 운영 중",
    githubUrl: "https://github.com/HyeongSeoku/FE_Blog",
  },
];

export function Projects() {
  return (
    <section
      id="PROJECT"
      className="scroll-mt-20 border-t border-gray-200 dark:border-gray-800"
      style={{ padding: "min(10rem, 16vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div className="max-w-[860px] mx-auto">
        {/* Section header */}
        <FadeInSection className="mb-12">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Side Project
          </p>
          <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900 dark:text-white">
            사이드 프로젝트
          </h2>
        </FadeInSection>

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
          {PROJECTS.map((project, i) => (
            <FadeInSection key={project.name} delay={i * 80}>
              <TiltCard className="h-full">
                <div className="group h-full flex flex-col gap-4 p-5 tablet:p-7 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] hover:border-primary/50 transition-colors duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base tablet:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        개인 개발 블로그
                      </h3>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:opacity-70 text-sm font-medium inline-flex items-center gap-1 transition-opacity"
                      >
                        {project.name}
                        <ExternalIcon size={12} />
                      </a>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap tabular-nums flex-shrink-0">
                      {project.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 dark:text-gray-500 hover:text-primary inline-flex items-center gap-1.5 transition-colors w-fit"
                    >
                      GitHub Repository
                      <ExternalIcon size={13} />
                    </a>
                  )}
                </div>
              </TiltCard>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
