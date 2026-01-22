"use client";

import { HeadingsProps } from "@/types/mdx";
import Link from "next/link";
import { useEffect, useState } from "react";
import classNames from "classnames";
import useScrollProgress from "@/hooks/useScrollProgress";
import useScrollPosition from "@/hooks/useScrollPosition";
import ArrowTop from "@/icon/arrow_top.svg";

export interface MdxSideBarProps {
  headings: HeadingsProps[];
}

const MdxSideBar = ({ headings }: MdxSideBarProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const progress = useScrollProgress();
  const { isScrollTop } = useScrollPosition();

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
        rootMargin: "-50px 0px -70% 0px",
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

    observeHeadings();

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside className="fixed top-24 right-6 w-44 hidden desktop:flex flex-col z-50">
      {/* 목차 */}
      <nav className="mb-6">
        <ul className="space-y-2 max-h-[400px] overflow-y-auto scroll-bar-thin pr-2">
          {headings.map((heading, idx) => (
            <li
              key={`${heading.id}_${idx}`}
              className={classNames("relative", {
                "pl-4": heading.level === 3,
              })}
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
                  "block text-sm py-1 transition-all duration-200 truncate",
                  activeId === heading.id
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300",
                )}
              >
                {heading.text}
              </Link>
              {activeId === heading.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-900 dark:bg-white rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 위로가기 버튼 */}
      <div
        className={classNames(
          "flex flex-col items-end gap-2 transition-opacity duration-300",
          isScrollTop ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
        <button
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
        >
          <ArrowTop className="w-5 h-5 text-white dark:text-gray-900" />
        </button>
      </div>
    </aside>
  );
};

export default MdxSideBar;
