"use client";

import { DynamicIsland, type DynamicIslandItem } from "@seoku/design-system";
import classNames from "classnames";
import type { RefObject } from "react";
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

  const handleItemSelect = (item: DynamicIslandItem) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    window.history.replaceState(null, "", `#${item.id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-x-0 top-3 z-40 hidden justify-center mobile:flex"
    >
      <div
        className={classNames(
          "transition-opacity duration-200",
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <DynamicIsland
          title={title}
          progress={progress}
          items={items}
          onItemSelect={handleItemSelect}
        />
      </div>
    </div>
  );
};

export default MobileReadingIsland;
