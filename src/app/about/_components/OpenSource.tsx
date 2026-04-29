"use client";

import { FadeInSection } from "./FadeInSection";
import { TiltCard } from "./TiltCard";

const CONTRIBUTIONS = [
  {
    project: "TanStack Query",
    version: "v5.90.18",
    link: "https://github.com/TanStack/query/pull/10025",
    prNumber: "PR #10025",
    description:
      "experimental_prefetchInRender 사용 시 데이터가 없는 경우에만 에러를 throw 하도록 수정하여 Suspense 동작과 일관성을 맞춤",
  },
  {
    project: "SSGOI",
    version: null,
    link: "https://github.com/meursyphus/ssgoi/pull/175",
    prNumber: "PR #175",
    description: "화면 전환 기여 및 테스트 코드(Jest) 작성",
  },
  {
    project: "react-multi-email",
    version: null,
    link: "https://github.com/axisj/react-multi-email/pull/164",
    prNumber: "PR #164",
    description:
      "테스트 코드 작성, 불필요한 로직 제거 및 성능 개선, 레거시 문법 최신화",
  },
];

export function OpenSource() {
  return (
    <section
      id="OPEN_SOURCE"
      className="scroll-mt-20 border-t border-gray-200 dark:border-gray-800"
      style={{ padding: "min(10rem, 16vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div className="max-w-[860px] mx-auto">
        {/* Section header */}
        <FadeInSection className="mb-12">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Open Source
          </p>
          <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900 dark:text-white">
            오픈소스 기여
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm tablet:text-base leading-relaxed">
            더 나은 개발 생태계를 위해 오픈소스 프로젝트에 기여하고 있습니다.
          </p>
        </FadeInSection>

        <div className="flex flex-col gap-4">
          {CONTRIBUTIONS.map((contrib, i) => (
            <FadeInSection key={contrib.project} delay={i * 80}>
              <TiltCard maxDeg={4}>
                <a
                  href={contrib.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-oss-card group flex flex-col tablet:flex-row tablet:items-center gap-4 p-5 tablet:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] no-underline"
                >
                  {/* Left accent */}
                  <div
                    className="hidden tablet:block flex-shrink-0 rounded-full ab-oss-accent"
                    style={{
                      width: "3px",
                      alignSelf: "stretch",
                      background: "var(--primary-color)",
                      opacity: 0.5,
                      minHeight: "3rem",
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                        {contrib.project}
                      </h3>
                      {contrib.version && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                          {contrib.version}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {contrib.description}
                    </p>
                  </div>

                  {/* PR link */}
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 tabular-nums group-hover:text-primary">
                    {contrib.prNumber} →
                  </span>
                </a>
              </TiltCard>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
