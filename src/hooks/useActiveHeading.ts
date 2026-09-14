import { useEffect, useState } from "react";
import type { HeadingsProps } from "@/types/mdx";

// 뷰포트 상단에서 이 지점을 지난 헤딩을 "현재 읽고 있는 섹션"으로 간주한다.
const ACTIVE_THRESHOLD_PX = 80;

/**
 * 헤딩 목록 중 현재 뷰포트 상단 기준선을 지난 마지막 헤딩의 id를 추적한다
 * (TOC/DynamicIsland 스크롤 스파이용).
 *
 * IntersectionObserver의 "지금 이 얇은 감지 영역 안에 있는가" 방식은 클릭
 * 내비게이션과 궁합이 나쁘다: scrollIntoView 착지 위치가 감지 영역 밖이거나,
 * smooth scroll 중 지나쳐가는 다른 헤딩이 다시 크로싱을 일으켜 값을 덮어쓰는
 * 경우가 있고, 한 번 놓친 크로싱은 다시 재생되지 않아 영영 갱신되지 않는 경우도
 * 생긴다. 대신 스크롤 위치를 직접 계산해 "기준선을 지난 마지막 헤딩"을 매 스크롤
 * 프레임마다 재계산하면, 클릭이든 수동 스크롤이든 항상 현재 위치와 일치한다.
 */
const useActiveHeading = (headings: HeadingsProps[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    let ticking = false;

    const measure = () => {
      let current: string | null = null;

      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;

        if (el.getBoundingClientRect().top <= ACTIVE_THRESHOLD_PX) {
          current = heading.id;
        } else {
          break;
        }
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        measure();
        ticking = false;
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return activeId;
};

export default useActiveHeading;
