"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import ParticleCanvas from "@/components/ParticleCanvas";
import {
  ABOUT_NAVIGATION_ID_LIST,
  ABOUT_NAVIGATION_SKILL_LABEL_MAP,
  ABOUT_SKILLS,
} from "@/constants/navigation.constants";

// ─── Scroll Fade-In Component ─────────────────────────────────────

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

// ─── Section Header (Apple Style) ─────────────────────────────────

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 tablet:mb-16">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3 block">
        {label}
      </span>
      <h2 className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base tablet:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    category: "Core",
    skills: ["React", "TypeScript", "Next.js", "JavaScript (ES6+)"],
  },
  {
    category: "Styling & UI",
    skills: ["Tailwind CSS", "CSS Modules", "Figma"],
  },
  {
    category: "Backend & Infra",
    skills: ["Node.js", "Nginx", "Jenkins", "Nexus"],
  },
  {
    category: "DevOps & DX",
    skills: [
      "GitHub Actions",
      "Webpack",
      "ESLint",
      "Prettier",
      "Husky",
      "SonarQube",
    ],
  },
];

const CAREERS = [
  {
    company: "NHN",
    role: "Frontend Developer",
    period: "2023.11 ~ 재직 중",
    projects: [
      {
        title: "사내 패키지 생태계(Nexus) 구축 및 레거시 자산화",
        period: "2025.01 ~ 2025.06",
        highlights: [
          "소스 코드가 유실된 커스텀 hls.js를 AI(Claude Code) 활용해 분석 및 복원, npm 패키지로 전환",
          "Nexus 기반 npm install 방식으로 표준화하여 버전 파편화 문제 해결",
          "전사 공통 디자인 시스템(TCDS) 파이프라인 구축",
          "Figma를 활용해 UI/UX 초안을 직접 설계하여 개발 병목 해소",
        ],
      },
      {
        title: "개발 생산성(DX) 및 배포 파이프라인 고도화",
        period: "2025.01 ~ 2025.12",
        highlights: [
          "GitHub Actions 도입으로 수동 배포 과정을 10분 → 2분 이내로 단축",
          "Husky, ESLint, Prettier, Type Check를 pre-commit 단계에 적용하여 코드 품질 강제화",
          "React.lazy 기반 Code Splitting으로 FCP/LCP 지표 개선",
          "Nginx HTTP/2 및 gzip_static으로 리소스 전송 효율 극대화",
        ],
      },
      {
        title: "대규모 레거시 리팩토링 및 서비스 운영",
        period: "2024.05 ~ 2024.11",
        highlights: [
          "불용 코드 및 중복 로직 약 9만 줄 제거로 유지보수성 확보 및 번들 사이즈 감소",
          "jQuery 기반 레거시 → 순수 JavaScript(ES6+) 및 TypeScript 전환",
          "일본 서비스 i18n 다국어 처리 및 SEO 최적화를 위한 Nginx 라우팅 커스텀",
        ],
      },
    ],
  },
  {
    company: "잡코리아",
    role: "Frontend Developer",
    period: "2022.07 ~ 2023.11",
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
        title: "알바몬 MSA 전환 프로젝트 프론트엔드 개발",
        period: "2022.07 ~ 2023.01",
        highlights: [
          ".Net 기반 레거시 → Next.js, TypeScript MSA 환경 전환",
          "모바일/PC/웹뷰 전반의 UI 및 비즈니스 로직 구현 전담",
          "React Query 도입으로 서버 부하 감소 및 상태 관리 최적화",
        ],
      },
      {
        title: "데이터 파이프라인 개선",
        period: "2023.04 ~ 2023.11",
        highlights: [
          "Braze/GA 로그 수집 모듈 공통화로 데이터 정합성 확보",
          "AppBridge 구조 개선으로 앱-웹 간 데이터 유실 문제 해결",
        ],
      },
    ],
  },
];

const OPEN_SOURCE_CONTRIBUTIONS = [
  {
    project: "TanStack Query",
    version: "v5.90.18",
    link: "https://github.com/TanStack/query/pull/10025",
    description:
      "experimental_prefetchInRender 사용 시 데이터가 없는 경우에만 에러를 throw 하도록 수정하여 Suspense 동작과 일관성을 맞춤",
  },
  {
    project: "SSGOI",
    version: null,
    link: "https://github.com/meursyphus/ssgoi/pull/175",
    description: "화면 전환 기여 및 테스트 코드(Jest) 작성",
  },
  {
    project: "react-multi-email",
    version: null,
    link: "https://github.com/axisj/react-multi-email/pull/164",
    description:
      "테스트 코드 작성, 불필요한 로직 제거 및 성능개선, 레거시 문법 최신화",
  },
];

function getCareerYears(): number {
  const now = new Date();
  const start = new Date(2022, 6, 1);
  const diffYears =
    (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.floor(diffYears) + 1;
}

const CAREER_YEARS = getCareerYears();

const KEY_METRICS = [
  { number: `${CAREER_YEARS}+`, label: "Experience" },
  { number: "7+", label: "Projects" },
  { number: "3", label: "Open Source" },
  { number: "15+", label: "Technologies" },
];

const PROJECT_TECH_STACK = [
  "Next.js 14",
  "React",
  "TypeScript",
  "SonarQube",
  "GitHub Actions",
  "Husky",
];

// ─── External Link Icon ───────────────────────────────────────────

function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function AboutPageClient() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo(0, 0);
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      {/* ═══ Hero Section ═══ */}
      <section className="w-full min-h-[calc(100vh-300px)] relative flex flex-col items-center justify-center overflow-hidden">
        <ParticleCanvas contained />

        <div className="z-20 rounded-2xl tablet:rounded-3xl overflow-hidden mb-4 tablet:mb-6">
          <div className="py-8 tablet:px-10 tablet:py-12">
            <h1 className="text-4xl tablet:text-5xl desktop:text-6xl font-black text-center tracking-tighter">
              KIM HYEONG SEOK
            </h1>
          </div>
        </div>

        <div className="relative rounded-2xl tablet:rounded-3xl">
          <div className="px-6 py-8 tablet:px-12 tablet:py-12 text-center">
            <div className="relative mb-6 tablet:mb-8 py-4">
              <div
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[110%] h-1 tablet:h-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #ff0000 15%, #ff3333 50%, #ff0000 85%, transparent 100%)",
                  boxShadow: `
                    0 0 4px #ff0000,
                    0 0 8px #ff0000,
                    0 0 16px rgba(255,0,0,0.6),
                    0 0 32px rgba(255,0,0,0.4)
                  `,
                }}
              />
              <h2 className="relative text-xl tablet:text-2xl font-bold tracking-widest uppercase text-gray-900 dark:text-white">
                FRONTEND DEVELOPER
              </h2>
            </div>

            <p className="text-sm tablet:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6 tablet:mb-8 max-w-lg mx-auto">
              복잡한 아이디어를 날카롭고 성능 좋은 웹 경험으로 변환합니다.
              <br className="mobile:hidden" />
              기술적 정밀함과 미학적 감각을 결합합니다.
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-2 tablet:gap-3 text-xs tablet:text-sm text-gray-500 tracking-widest">
              {ABOUT_NAVIGATION_ID_LIST.map((navId, index) => (
                <span
                  key={navId}
                  className="flex items-center gap-2 tablet:gap-3"
                >
                  {index > 0 && (
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                  )}
                  <a
                    href={`#${navId}`}
                    className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {
                      ABOUT_NAVIGATION_SKILL_LABEL_MAP[
                        navId as keyof typeof ABOUT_NAVIGATION_SKILL_LABEL_MAP
                      ]
                    }
                  </a>
                </span>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-center gap-2 tablet:gap-3 text-xs tablet:text-sm text-gray-500 tracking-widest mt-3">
              {ABOUT_SKILLS.map((skill, index) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 tablet:gap-3"
                >
                  {index > 0 && (
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                  )}
                  <span className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-default">
                    {skill}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Summary + Metrics ═══ */}
      <section className="w-full py-20 tablet:py-32 px-6 tablet:px-12">
        <FadeIn className="max-w-4xl mx-auto">
          <p className="text-center text-lg tablet:text-xl desktop:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            <strong className="font-semibold text-gray-900 dark:text-white">
              {CAREER_YEARS}년차
            </strong>{" "}
            웹 프론트엔드 엔지니어로, 빠른 UI 개발은 기본,{" "}
            <strong className="font-semibold text-gray-900 dark:text-white">
              확장성과 성능, 안정성
            </strong>
            을 높인 컴포넌트를 제작합니다.
            <br className="mobile:hidden" />
            레거시 프로젝트를 현대의 기술로 전환하는 작업에 주력하며, 다양한
            문제를 코드로 풀어나가는 것을 즐깁니다.
          </p>

          <div className="grid grid-cols-2 tablet:grid-cols-4 gap-6 tablet:gap-8 mt-16 tablet:mt-20">
            {KEY_METRICS.map((metric, idx) => (
              <FadeIn key={metric.label} delay={idx * 100}>
                <div className="text-center">
                  <div className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {metric.number}
                  </div>
                  <div className="text-xs tablet:text-sm text-gray-400 dark:text-gray-500 tracking-wide uppercase">
                    {metric.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══ Skills Section ═══ */}
      <section
        id="SKILL"
        className="w-full py-20 tablet:py-32 px-6 tablet:px-12 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              label="Skills"
              title="기술 스택"
              description="프론트엔드를 중심으로, 백엔드와 인프라까지 확장하며 역량을 키워가고 있습니다."
            />
          </FadeIn>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5 tablet:gap-6">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <FadeIn key={cat.category} delay={idx * 100}>
                <div className="h-full p-6 tablet:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 text-sm rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Career Section ═══ */}
      <section
        id="CAREER"
        className="w-full py-20 tablet:py-32 px-6 tablet:px-12 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              label="Career"
              title="경력"
              description="웹과 하이브리드 앱 환경에서 레거시 전환부터 신규 서비스 구축까지 다양한 프로젝트를 수행해왔습니다."
            />
          </FadeIn>

          <div className="space-y-20 tablet:space-y-28">
            {CAREERS.map((career, careerIdx) => (
              <FadeIn key={career.company} delay={careerIdx * 120}>
                {/* Company Header */}
                <div className="flex flex-col tablet:flex-row tablet:items-baseline gap-2 tablet:gap-5 mb-8 tablet:mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl tablet:text-3xl font-bold text-gray-900 dark:text-white">
                    {career.company}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{career.role}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <span>{career.period}</span>
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-5">
                  {career.projects.map((project, projIdx) => (
                    <FadeIn
                      key={project.title}
                      delay={careerIdx * 120 + projIdx * 80}
                    >
                      <div className="p-6 tablet:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                        <div className="flex flex-col tablet:flex-row tablet:items-baseline gap-1 tablet:gap-4 mb-5">
                          <h4 className="text-base tablet:text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                            {project.title}
                          </h4>
                          <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                            {project.period}
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {project.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex items-start gap-3 text-sm tablet:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[7px] flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Side Project Section ═══ */}
      <section
        id="PROJECT"
        className="w-full py-20 tablet:py-32 px-6 tablet:px-12 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader label="Side Project" title="사이드 프로젝트" />
          </FadeIn>

          <FadeIn delay={100}>
            <div className="p-8 tablet:p-10 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex flex-col tablet:flex-row tablet:items-start tablet:justify-between gap-3 tablet:gap-6 mb-6">
                <div>
                  <h3 className="text-xl tablet:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    개인 개발 블로그
                  </h3>
                  <a
                    href="https://sseoku.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:opacity-70 text-sm font-medium transition-opacity"
                  >
                    sseoku.com
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  2024.08 ~ 운영중
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-[15px]">
                Next.js 14, TypeScript로 직접 구축 및 운영하는 개인
                블로그입니다. 학습한 내용과 트러블 슈팅 과정을 꾸준히 기록하고
                있습니다.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {PROJECT_TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 text-sm rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://github.com/HyeongSeoku/FE_Blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                >
                  Frontend Repository
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Open Source Section ═══ */}
      <section
        id="OPEN_SOURCE"
        className="w-full py-20 tablet:py-32 px-6 tablet:px-12 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionHeader
              label="Open Source"
              title="오픈소스 기여"
              description="더 나은 개발 생태계를 위해 오픈소스 프로젝트에 기여하고 있습니다."
            />
          </FadeIn>

          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-5 tablet:gap-6">
            {OPEN_SOURCE_CONTRIBUTIONS.map((contrib, idx) => (
              <FadeIn key={contrib.project} delay={idx * 100}>
                <a
                  href={contrib.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full p-6 tablet:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-white/[0.02] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {contrib.project}
                    </h3>
                    <ExternalLinkIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>

                  {contrib.version && (
                    <span className="inline-block text-xs text-primary font-semibold mb-3 tracking-wide">
                      {contrib.version}
                    </span>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {contrib.description}
                  </p>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Blog CTA Section ═══ */}
      <section
        id="BLOG"
        className="w-full py-24 tablet:py-36 px-6 tablet:px-12 scroll-mt-20"
      >
        <FadeIn className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
            Blog
          </span>
          <h2 className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            더 많은 이야기가
            <br className="tablet:hidden" /> 궁금하다면
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
            개발하며 마주친 문제와 해결 과정, 새로 배운 기술들을 블로그에
            기록하고 있습니다.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm tracking-wide hover:opacity-80 transition-opacity"
          >
            블로그 둘러보기
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>

      {/* ═══ Education & Contact ═══ */}
      <section className="w-full py-16 tablet:py-24 px-6 tablet:px-12 border-t border-gray-200 dark:border-gray-800">
        <FadeIn className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-12 tablet:gap-16">
            {/* Education */}
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
                Education
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                나사렛대학교
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                IT학부 · 2016.03 ~ 2022.02
              </p>
            </div>

            {/* Contact */}
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
                Contact
              </span>
              <div className="space-y-3">
                <a
                  href="mailto:gudtjr3437@gmail.com"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  gudtjr3437@gmail.com
                </a>
                <a
                  href="https://github.com/HyeongSeoku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  GitHub
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/%ED%98%95%EC%84%9D-%EA%B9%80-901539232/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  LinkedIn
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
