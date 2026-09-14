import { useEffect, useState } from "react";
import type { HeadingsProps } from "@/types/mdx";

/** 헤딩 목록 중 현재 뷰포트 상단에 걸린 항목의 id를 추적한다 (TOC 스크롤 스파이용). */
const useActiveHeading = (headings: HeadingsProps[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => !!el);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-64px 0px -70% 0px" },
    );

    // biome-ignore lint/suspicious/useIterableCallbackReturn: observe returns void
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
};

export default useActiveHeading;
