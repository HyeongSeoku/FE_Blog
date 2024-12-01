"use client";

import { HeadingsProps } from "@/types/mdx";
import Link from "next/link";
import { ANIMAITE_FADE_IN_UP } from "@/constants/animation.constants";

export interface MdxSideBarProps {
  headings: HeadingsProps[];
}

const MdxSideBar = ({ headings }: MdxSideBarProps) => {
  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="absolute top-[100px] right-[100px] p-4 w-fit h-fit max-w-[150px] max-h-[700px] border-gray-200 flex flex-col xl:opacity-0 transform duration-300">
      <ul className="space-y-2 h-fit max-h-[500px] overflow-y-scroll scroll-bar-thin">
        {headings.map((heading, idx) => (
          <li
            key={`${heading}_${idx}`}
            className={`${
              heading.level === 2 ? "ml-4" : ""
            } ${ANIMAITE_FADE_IN_UP} text-sm text-gray-700 hover:text-white transform duration-300`}
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
              className="block truncate"
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
