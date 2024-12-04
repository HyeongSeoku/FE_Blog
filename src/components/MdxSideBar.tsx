"use client";

import { HeadingsProps } from "@/types/mdx";
import Link from "next/link";
import { ANIMAITE_FADE_IN_UP } from "@/constants/animation.constants";
import { useEffect, useState } from "react";
import classNames from "classnames";

export interface MdxSideBarProps {
  headings: HeadingsProps[];
}

const MdxSideBar = ({ headings }: MdxSideBarProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -50% 0px",
        threshold: 1.0,
      },
    );

    const targets = headings.map((heading) =>
      document.getElementById(heading.id),
    );
    targets.forEach((target) => {
      if (target) observer.observe(target);
    });

    return () => {
      targets.forEach((target) => {
        if (target) observer.unobserve(target);
      });
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="fixed top-[100px] right-[50px] p-4 w-fit h-fit max-w-[150px] max-h-[700px] border-gray-200 flex flex-col xl:opacity-0 transform duration-300">
      <ul className="space-y-2 h-fit max-h-[500px] overflow-y-scroll scroll-bar-thin">
        {headings.map((heading, idx) => (
          <li
            key={`${heading}_${idx}`}
            className={classNames(
              "text-sm text-gray-700 hover:text-[var(--text-color)] transform transition-colors duration-300",
              ANIMAITE_FADE_IN_UP,
              {
                "ml-4": heading.level === 2,
                "text-blue-600 font-bold": activeId === heading.id,
              },
            )}
            style={{ animationDelay: `${idx * 20}ms` }}
          >
            <Link
              href={`#${heading.id}`}
              scroll={false}
              onClick={(e) => {
                e.preventDefault();
                window.history.replaceState(null, "", `#${heading.id}`);
                handleClick(heading.id);
              }}
              className={classNames(
                "block truncate transition-colors duration-300",
              )}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MdxSideBar;
