"use client";

import { HeadingsProps } from "@/types/mdx";
import Link from "next/link";

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
    <aside className="sticky top-[100px] p-4 border-r h-[700px] border-gray-200 w-64 flex flex-col">
      <ul className="space-y-2 h-fit max-h-[500px] overflow-y-scroll scroll-bar-thin">
        {headings.map((heading, idx) => (
          <li
            key={`${heading}_${idx}`}
            className={`${
              heading.level === 2 ? "ml-4" : ""
            } text-sm text-gray-700 hover:text-white`}
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
