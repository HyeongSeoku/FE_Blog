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
    <>
      {/* 목차 - 접힌 상태에서는 막대만, hover시 펼침 */}
      <aside className="fixed top-24 right-6 hidden desktop:block z-50">
        <nav className="group">
          <ul className="relative max-h-[400px] overflow-y-auto scroll-bar-thin">
            {headings.map((heading, idx) => {
              const isActive = activeId === heading.id;
              const isSubHeading = heading.level === 3;

              return (
                <li
                  key={`${heading.id}_${idx}`}
                  className="relative flex items-center"
                >
                  {/* 접힌 상태: 막대 인디케이터 (레벨에 따라 크기 다름) */}
                  <span
                    className={classNames(
                      "rounded-full transition-all duration-200 flex-shrink-0",
                      isSubHeading ? "w-[1px] h-2 my-1.5" : "w-0.5 h-4 my-1",
                      isActive
                        ? "bg-gray-900 dark:bg-white"
                        : "bg-gray-300 dark:bg-gray-600",
                      isActive && !isSubHeading && "h-5",
                      isActive && isSubHeading && "h-3",
                    )}
                  />

                  {/* 펼친 상태: 텍스트 (hover시 나타남, 레벨에 따라 들여쓰기) */}
                  <Link
                    href={`#${heading.id}`}
                    scroll={false}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.replaceState(null, "", `#${heading.id}`);
                      handleClick(heading.id);
                    }}
                    className={classNames(
                      "block py-1 whitespace-nowrap",
                      "w-0 opacity-0 overflow-hidden",
                      "group-hover:w-40 group-hover:opacity-100",
                      "transition-all duration-300 ease-out group-hover:ml-1",
                      isSubHeading
                        ? "text-xs group-hover:pl-3"
                        : "text-sm group-hover:pl-0",
                      isActive
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300",
                    )}
                  >
                    {heading.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 위로가기 버튼 - 별도 fixed로 분리 */}
      <div
        className={classNames(
          "fixed bottom-6 right-6 hidden desktop:flex flex-col items-start gap-2 z-50",
          "transition-opacity duration-300",
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
    </>
  );
};

export default MdxSideBar;
