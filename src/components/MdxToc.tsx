"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";
import type { HeadingsProps } from "@/types/mdx";

const MIN_HEADINGS_TO_SHOW = 3;

export interface MdxTocProps {
  headings: HeadingsProps[];
}

const MdxToc = ({ headings }: MdxTocProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length < MIN_HEADINGS_TO_SHOW) return;

    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => !!el);

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

  if (headings.length < MIN_HEADINGS_TO_SHOW) return null;

  return (
    <nav className="mb-sk-section-lg flex flex-col gap-2 border-l border-hairline pl-4">
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={classNames(
            "text-sk-meta transition-opacity hover:opacity-[.55]",
            heading.level === 3 && "pl-3",
            activeId === heading.id ? "text-theme" : "text-muted",
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
};

export default MdxToc;
