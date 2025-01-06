"use client";

import { HeadingsProps } from "@/types/mdx";
import Link from "next/link";
import { ANIMAITE_FADE_IN_UP } from "@/constants/animation.constants";
import { RefObject, useEffect, useState } from "react";
import classNames from "classnames";
import MoScrollProgress from "./MoScrollProgress";

import CommentIcon from "@/icon/comment.svg";

export interface MdxSideBarProps {
  headings: HeadingsProps[];
  commentRef: RefObject<HTMLElement>;
}

const MdxSideBar = ({ headings, commentRef }: MdxSideBarProps) => {
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
        rootMargin: "-50px 0px 0px 0px",
        threshold: 1,
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
      const yPosition = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({ top: yPosition, behavior: "smooth" });
      setActiveId(id);
    }
  };

  const handleScrollToCommentSection = () => {
    if (commentRef.current) {
      const yOffset = -50;
      const yPosition =
        commentRef.current.getBoundingClientRect().top +
        window.scrollY +
        yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <aside className="fixed top-[100px] right-[50px] p-4 w-fit h-fit max-w-[150px] max-h-[700px] border-gray-200 flex flex-col xl:opacity-0 transform duration-300 md:hidden">
        <ul className="space-y-2 h-fit max-h-[500px] overflow-y-scroll scroll-bar-thin">
          {headings.map((heading, idx) => (
            <li
              key={`${heading}_${idx}`}
              className={classNames(
                "text-sm hover:text-[var(--text-color)] transform transition-colors duration-100",
                ANIMAITE_FADE_IN_UP,
                {
                  "ml-4": heading.level === 3,
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
        <button
          className="w-8 p-1 mt-5 rounded-sm hover:bg-gray-400/20"
          onClick={handleScrollToCommentSection}
        >
          <CommentIcon width={24} height={24} />
        </button>
      </aside>

      {/* NOTE: MO용 side */}
      <aside className="fixed bottom-10 right-2 p-1 z-10 flex flex-col items-center gap-2 min-md:hidden bg-gray-400/20 rounded-lg">
        <button
          className="w-8 h-8 rounded-sm hover:bg-gray-400/20 flex items-center justify-center"
          onClick={handleScrollToCommentSection}
        >
          <CommentIcon width={26} height={26} />
        </button>
        <MoScrollProgress />
      </aside>
    </>
  );
};

export default MdxSideBar;
