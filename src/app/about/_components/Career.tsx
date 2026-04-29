"use client";

import { useState } from "react";
import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";
import { FadeInSection } from "./FadeInSection";

interface Project {
  title: string;
  period: string;
  highlights: string[];
}

interface CareerItem {
  company: string;
  role: string;
  period: string;
  isLive: boolean;
  projects: Project[];
}

const CAREERS: CareerItem[] = [
  {
    company: "NHN",
    role: "Frontend Developer",
    period: "2023.11 ~ 현재",
    isLive: true,
    projects: [
      {
        title: "사내 패키지 생태계(Nexus) 구축 및 라이브러리 관리 체계화",
        period: "2026.01 ~ 2026.03",
        highlights: [
          "소스 코드 유실된 커스텀 hls.js를 빌드 역분석으로 복원, npm 패키지 전환 및 Nexus 버전 관리",
          "프로젝트마다 빌드 파일 직접 복사하던 방식을 Nexus 기반 npm install로 표준화, 버전 파편화 제거",
          "HEVC 카메라 재생 불가 이슈 대응: hls.js v1.4.14 → v1.6.15 업그레이드 & 커스터마이징",
          "HLS 영상 3초 점프 버그 수정: HAR → TS PTS → Chrome MSE 레이어까지 추적, remuxer 3곳 패치로 해결",
          "디자인 리소스 부재 상황에서 Figma를 활용해 UI/UX 초안을 직접 설계, 개발 병목 해소",
        ],
      },
      {
        title: "디자인 시스템(TCDS) 구축",
        period: "2026.03",
        highlights: [
          "B2B 서비스 Next.js 마이그레이션 선행 작업으로, 전사 공통 UI 라이브러리 설계·구축",
          "69개 컴포넌트 구현: 범용 36개(Radix UI) + B2B 특화 33개. Figma MCP + Claude Code로 디자인 토큰 추출 자동화",
          "Storybook 도입: UI 명칭 혼선 해소, 배포 없이 기획자 직접 동작 확인 가능",
          "Playwright VRT 도입: Docker 환경으로 OS 픽셀 차이 제거, CI 게이트 통합으로 시각적 회귀 자동 감지",
          "GitHub Actions label 기반 자동 버전 bump → Nexus 자동 배포",
        ],
      },
      {
        title: "개발 생산성(DX) 및 배포 파이프라인 고도화",
        period: "2025.01 ~ 2025.12",
        highlights: [
          "GitHub Actions + NHN Cloud Deploy API로 배포 완전 자동화. alpha/beta/real 3환경 분리, Dooray 알림 연동 — 배포 소요시간 80% 단축",
          "Husky + ESLint/Prettier/Type Check pre-commit 적용, 불량 코드 유입 차단",
          "React.lazy Code Splitting + hls.js Lazy Loading으로 FCP/LCP 개선",
          "Nginx HTTP/2 + gzip_static으로 정적 리소스 전송 최적화",
        ],
      },
      {
        title: "대규모 레거시 리팩토링 및 서비스 운영",
        period: "2024.05 ~ 2024.11",
        highlights: [
          "불용 코드·중복 로직 90,714줄 제거 (Gulp/AngularJS), 번들 사이즈 감소 및 유지보수성 향상",
          "jQuery → ES6+ 전환으로 의존성 제거. URL 구조를 query string 파싱으로 개편, 인코딩 오류·보안 위험 제거",
          "i18n 다국어 처리 및 SEO 대응: 일본 서비스 Nginx 라우팅/Webpack 빌드 커스텀",
          "Vue 2 기반 사내 컴포넌트 라이브러리 유지보수",
        ],
      },
    ],
  },
  {
    company: "잡코리아",
    role: "Frontend Developer",
    period: "2022.07 ~ 2023.11",
    isLive: false,
    projects: [
      {
        title: "알바몬 모바일 이력서 작성 페이지 개편",
        period: "2023.07 ~ 2023.08",
        highlights: [
          "이력서 완료율 50% → 83%로 33%p 상승",
          "기획/디자인 리뷰 단계에서 개발자 관점의 UX 개선안 적극 제안 및 반영",
        ],
      },
      {
        title: "Analytics 연동 및 앱-웹 통신 안정화",
        period: "2023.04 ~ 2023.11",
        highlights: [
          "Braze/GA 인스턴스 개발: 전사 공통 로그 수집 모듈 개발, 데이터 정합성 확보",
          "AppBridge 구조 개선: 앱-웹 통신 데이터 유실 문제를 레거시(.Net) 로직 분석으로 해결",
        ],
      },
      {
        title: "알바몬 MSA 전환 프로젝트 프론트엔드 개발",
        period: "2022.07 ~ 2023.01",
        highlights: [
          ".Net 기반 레거시를 MSA 환경(Next.js, TypeScript)으로 전환, 모바일/PC/웹뷰 전반 UI·비즈니스 로직 전담",
          "서비스 안정화: 신규 아키텍처 도입 초기 운영 이슈와 버그 신속 파악·해결",
          "기존 페이지 성능 병목 구간 개선으로 로딩 속도 단축 및 사용자 점유율 향상",
          "React Query 직접 도입으로 불필요한 API 호출 제거, 서버 부하 감소 및 상태 관리 최적화",
        ],
      },
    ],
  },
];

const HIGHLIGHT_PATTERNS = [
  "80% 단축",
  "33%p 상승",
  "90,714줄",
  "50% → 83%",
  "69개",
];

const HIGHLIGHT_REGEX = new RegExp(
  `(${HIGHLIGHT_PATTERNS.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g",
);

function HighlightText({ text }: { text: string }) {
  const parts = text.split(HIGHLIGHT_REGEX);

  return (
    <>
      {parts.map((part, i) =>
        HIGHLIGHT_PATTERNS.includes(part) ? (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: split fragments
            key={i}
            className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[0.85em] font-medium"
          >
            {part}
          </span>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: split fragments
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 p-4 tablet:p-5 text-left bg-gray-50/60 dark:bg-white/[0.02] hover:bg-gray-100/80 dark:hover:bg-white/[0.04] transition-colors duration-150"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm tablet:text-[0.925rem] font-medium text-gray-900 dark:text-white leading-snug mb-1">
            {project.title}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {project.period}
          </span>
        </div>
        <span
          className="text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-250"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
          aria-hidden="true"
        >
          ›
        </span>
      </button>

      <div className={`ab-accordion-body${open ? " open" : ""}`}>
        <div className="ab-accordion-inner">
          <ul className="p-4 tablet:p-5 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3 list-none m-0">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                <span
                  className="w-1 h-1 rounded-full bg-primary flex-shrink-0"
                  style={{ marginTop: "0.5rem" }}
                  aria-hidden="true"
                />
                <HighlightText text={h} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Career() {
  const { ref: sectionRef, isIntersecting: lineDrawn } =
    useIntersectionObserver<HTMLElement>(0.15);

  return (
    <section
      ref={sectionRef}
      id="CAREER"
      className="scroll-mt-20 border-t border-gray-200 dark:border-gray-800"
      style={{ padding: "min(10rem, 16vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div className="max-w-[860px] mx-auto">
        {/* Section header */}
        <FadeInSection className="mb-14">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Career
          </p>
          <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900 dark:text-white">
            경력
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm tablet:text-base leading-relaxed">
            웹과 하이브리드 앱 환경에서 레거시 전환부터 신규 서비스 구축까지
            다양한 프로젝트를 수행해왔습니다.
          </p>
        </FadeInSection>

        {/* Timeline */}
        <div className="flex flex-col">
          {CAREERS.map((career, careerIdx) => (
            <div key={career.company} className="flex gap-5 tablet:gap-8">
              {/* Left: dot + connector */}
              <div
                className="flex flex-col items-center flex-shrink-0 w-3"
                style={{ paddingTop: "0.3rem" }}
              >
                <div
                  className="flex-shrink-0 rounded-full transition-all duration-500"
                  style={{
                    width: "0.75rem",
                    height: "0.75rem",
                    background: career.isLive
                      ? "var(--primary-color)"
                      : "transparent",
                    border: `2px solid ${career.isLive ? "var(--primary-color)" : "var(--description-text-color, #a8afbd)"}`,
                    transitionDelay: `${careerIdx * 200}ms`,
                    boxShadow:
                      lineDrawn && career.isLive
                        ? "0 0 10px rgba(10,186,181,0.5)"
                        : "none",
                  }}
                />
                {careerIdx < CAREERS.length - 1 && (
                  <div className="flex-1 w-px mt-2 overflow-hidden">
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        background: career.isLive
                          ? `linear-gradient(to bottom, var(--primary-color), var(--border-color, #cccccc))`
                          : "var(--border-color, #cccccc)",
                        transform: lineDrawn ? "scaleY(1)" : "scaleY(0)",
                        transformOrigin: "top",
                        transition:
                          "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
                        transitionDelay: "0.3s",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Right: content */}
              <FadeInSection
                delay={careerIdx * 100}
                style={{
                  flex: 1,
                  paddingBottom:
                    careerIdx < CAREERS.length - 1 ? "3.5rem" : "0",
                  minWidth: 0,
                }}
              >
                {/* Company header */}
                <div className="flex flex-col mobile:flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-1 tablet:gap-4 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl tablet:text-2xl font-bold text-gray-900 dark:text-white">
                      {career.company}
                    </h3>

                    {career.isLive && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500 tracking-wide">
                        <span
                          className="ab-pulse inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                          aria-hidden="true"
                        />
                        현재 재직 중
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 flex-wrap">
                    <span>{career.role}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{career.period}</span>
                  </div>
                </div>

                {/* Projects */}
                <div className="flex flex-col gap-2.5">
                  {career.projects.map((project) => (
                    <ProjectCard key={project.title} project={project} />
                  ))}
                </div>
              </FadeInSection>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
