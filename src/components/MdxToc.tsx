"use client";

import classNames from "classnames";
import useActiveHeading from "@/hooks/useActiveHeading";
import type { HeadingsProps } from "@/types/mdx";

const MIN_HEADINGS_TO_SHOW = 3;

export interface MdxTocProps {
  headings: HeadingsProps[];
}

const MdxToc = ({ headings }: MdxTocProps) => {
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
    <nav className="mb-sk-section-lg flex flex-col gap-2 border-l border-hairline pl-4 mobile:hidden">
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(event) => handleClick(event, heading.id)}
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
