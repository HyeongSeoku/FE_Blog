"use client";

import { HeadingsProps } from "@/types/mdx";
import Link from "next/link";
import { RefObject, useEffect, useState } from "react";
import classNames from "classnames";
import MoScrollProgress from "./MoScrollProgress";

import CommentIcon from "@/icon/comment.svg";

export interface MdxSideBarProps {
  headings: HeadingsProps[];
  commentRef?: RefObject<HTMLElement>;
  commentTargetId?: string;
}

const MdxSideBar = ({
  headings,
  commentRef,
  commentTargetId = "giscusSection",
}: MdxSideBarProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const HEADER_HEIGHT = 56;

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

    const observeHeadings = () => {
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
    };

    observeHeadings(); // 최초 실행

    // DOM 변경을 감지하여 observer 재설정
    const mutationObserver = new MutationObserver(() => {
      observeHeadings();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const yPosition =
        target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

      window.scrollTo({ top: yPosition, behavior: "smooth" });
      setActiveId(id);
    }
  };

  const handleScrollToCommentSection = () => {
    const el = commentRef?.current ?? document.getElementById(commentTargetId); // ref 없으면 id로 찾기

    if (el) {
      const yOffset = -50;
      const yPosition =
        el.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <aside className="fixed top-[100px] right-[20px] p-4 w-fit h-fit max-w-[150px] max-h-[700px] border-gray-200 flex flex-col transform duration-300 lg:opacity-0 md:hidden z-50">
        <ul className="space-y-2 h-fit max-h-[500px] overflow-y-scroll scroll-bar-thin">
          {headings.map((heading, idx) => (
            <li
              key={`${heading.id}_${idx}`}
              className={classNames(
                "text-sm hover:text-theme transition-colors duration-100",
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
          <CommentIcon style={{ width: 24, height: 24 }} />
        </button>
      </aside>

      {/* NOTE: MO용 side */}
      <aside className="fixed bottom-10 right-2 p-1 z-50 flex flex-col items-center gap-2 min-md:hidden bg-gray-400/20 rounded-lg">
        <button
          className="w-8 h-8 rounded-sm hover:bg-gray-400/20 flex items-center justify-center"
          onClick={handleScrollToCommentSection}
        >
          <CommentIcon style={{ width: 24, height: 24 }} />
        </button>
        <MoScrollProgress />
      </aside>
    </>
  );
};

export default MdxSideBar;
