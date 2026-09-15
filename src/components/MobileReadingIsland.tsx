"use client";

import classNames from "classnames";
import type { RefObject } from "react";
import {
  DynamicIsland,
  type DynamicIslandItem,
} from "@/components/DynamicIsland";
import useActiveHeading from "@/hooks/useActiveHeading";
import useArticleReadingProgress from "@/hooks/useArticleReadingProgress";
import type { HeadingsProps } from "@/types/mdx";

export interface MobileReadingIslandProps {
  title: string;
  headings: HeadingsProps[];
  articleRef: RefObject<HTMLElement>;
}

const MobileReadingIsland = ({
  title,
  headings,
  articleRef,
}: MobileReadingIslandProps) => {
  const activeId = useActiveHeading(headings);
  const { progress, visible } = useArticleReadingProgress(articleRef);

  const items: DynamicIslandItem[] = headings.map((heading) => ({
    id: heading.id,
    label: heading.text,
    active: heading.id === activeId,
  }));

  const activeItem = items.find((item) => item.active);
  const pillLabel = activeItem?.label ?? title;

  const handleItemSelect = (item: DynamicIslandItem) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    window.history.replaceState(null, "", `#${item.id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-x-0 z-40 hidden h-10 items-start justify-center mobile:flex"
      style={{ top: "var(--header-top-padding)" }}
    >
      {/*
        래퍼를 items-center로 세로 중앙 정렬하면, 펼쳐져서 키가 커질 때
        중앙 기준으로 위/아래 균등하게 늘어나 헤더 위쪽 화면 밖으로 넘친다.
        items-start + mt-1(접혔을 때 세로 중앙과 같은 오프셋)로 위쪽을 고정하고
        아래로만 펼쳐지게 한다.
      */}
      <div
        className={classNames(
          "mt-1 transition-opacity duration-200",
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <DynamicIsland
          title={pillLabel}
          progress={progress}
          items={items}
          onItemSelect={handleItemSelect}
        />
      </div>
    </div>
  );
};

export default MobileReadingIsland;
