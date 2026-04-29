"use client";

import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

export function BlogCta() {
  return (
    <section
      id="BLOG"
      className="scroll-mt-20 border-t border-gray-200 dark:border-gray-800"
      style={{ padding: "min(10rem, 16vh) clamp(1.5rem, 5vw, 4rem)" }}
    >
      <FadeInSection className="max-w-[640px] mx-auto text-center flex flex-col items-center gap-6">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Blog
        </p>

        <h2 className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          더 많은 이야기가 궁금하다면
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm tablet:text-base leading-relaxed max-w-md">
          개발하며 마주친 문제와 해결 과정, 새로 배운 기술들을 블로그에 기록하고
          있습니다.
        </p>

        <Link href="/blog" className="ab-cta-btn">
          블로그 둘러보기
          <span aria-hidden="true">→</span>
        </Link>
      </FadeInSection>
    </section>
  );
}
