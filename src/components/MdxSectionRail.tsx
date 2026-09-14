"use client";

import classNames from "classnames";
import useActiveHeading from "@/hooks/useActiveHeading";
import type { HeadingsProps } from "@/types/mdx";

const MIN_HEADINGS_TO_SHOW = 3;

export interface MdxSectionRailProps {
  headings: HeadingsProps[];
}

// 레벨이 낮을수록(상위 섹션일수록) 선이 굵고 진하다.
const LINE_STYLE_BY_LEVEL: Record<number, { size: string; bar: string }> = {
  1: { size: "h-[2px] w-5", bar: "bg-muted" },
  2: { size: "h-[2px] w-4", bar: "bg-muted" },
  3: { size: "h-px w-2", bar: "bg-muted opacity-70" },
};
const DEFAULT_LINE_STYLE = { size: "h-px w-1.5", bar: "bg-muted opacity-60" };

/**
 * PC 전용 플로팅 섹션 레일 — 화면 오른쪽에 고정된 라인 + 텍스트로 헤딩 목록을
 * 상시 표시한다. 스크롤해도 사라지지 않고, hover 시 항목 간 간격이 넓어진다.
 */
const MdxSectionRail = ({ headings }: MdxSectionRailProps) => {
  const activeId = useActiveHeading(headings);

  if (headings.length < MIN_HEADINGS_TO_SHOW) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="섹션 바로가기"
      className="group/nav fixed right-6 top-[var(--space-section)] z-30 hidden flex-col items-end gap-1 transition-[gap] duration-200 ease-out desktop:flex hover:gap-3"
    >
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        const lineStyle =
          LINE_STYLE_BY_LEVEL[heading.level] ?? DEFAULT_LINE_STYLE;

        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(event) => handleClick(event, heading.id)}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2 py-0.5"
          >
            <span
              className={classNames(
                "whitespace-nowrap text-[11px] font-normal opacity-0 transition-[opacity,color] duration-150 group-hover/nav:opacity-100",
                isActive
                  ? "text-primary"
                  : "text-muted group-hover:text-primary-hover",
              )}
            >
              {heading.text}
            </span>
            <span
              className={classNames(
                "block shrink-0 rounded-full transition-colors",
                lineStyle.size,
                isActive
                  ? "bg-primary"
                  : classNames(lineStyle.bar, "group-hover:bg-primary-hover"),
              )}
            />
          </a>
        );
      })}
    </nav>
  );
};

export default MdxSectionRail;
