import { type RefObject, useEffect, useRef, useState } from "react";

interface ArticleReadingProgress {
  /** 0~100, 아티클 영역 기준 읽기 진행률 */
  progress: number;
  /** 첫 문단을 지나 아티클 중간까지 스크롤했고, 위로(뒤로) 스크롤 중일 때만 true */
  visible: boolean;
}

// 아티클 상단이 뷰포트 상단 35% 지점을 넘어야 "첫 문단을 읽었다"고 판단한다.
// 헤더(제목·메타·태그·대표이미지) 블록이 이미 그 정도 높이를 차지하므로,
// 아티클 최상단이 여기 도달할 즈음엔 최소 첫 문단은 스크롤을 통해 지나간 뒤다.
const START_VIEWPORT_RATIO = 0.35;
const END_OFFSET_PX = 80;

// 이 값보다 작은 스크롤 변화는 방향 판정에 반영하지 않는다 (모멘텀 스크롤이
// 멈추는 순간의 미세한 역방향 흔들림으로 계속 켜졌다 꺼졌다 하는 걸 방지).
const DIRECTION_THRESHOLD_PX = 4;

const useArticleReadingProgress = (
  articleRef: RefObject<HTMLElement>,
): ArticleReadingProgress => {
  const [state, setState] = useState<ArticleReadingProgress>({
    progress: 0,
    visible: false,
  });

  const lastScrollYRef = useRef(0);
  const isScrollingUpRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const measure = () => {
      const el = articleRef.current;
      if (!el) return;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      if (Math.abs(delta) >= DIRECTION_THRESHOLD_PX) {
        isScrollingUpRef.current = delta < 0;
        lastScrollYRef.current = currentScrollY;
      }

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const total = rect.height + viewportHeight;
      const scrolled = viewportHeight - rect.top;
      const progress = Math.min(100, Math.max(0, (scrolled / total) * 100));

      const hasStarted = rect.top < viewportHeight * START_VIEWPORT_RATIO;
      const hasEnded = rect.bottom < END_OFFSET_PX;

      setState({
        progress,
        visible: hasStarted && !hasEnded && isScrollingUpRef.current,
      });
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
  }, [articleRef]);

  return state;
};

export default useArticleReadingProgress;
