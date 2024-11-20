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
    <aside className="toc p-4 border-r border-gray-200 w-64">
      <h2 className="font-bold text-lg mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading, idx) => (
          <li
            key={`${heading}_${idx}`}
            className={`toc-item ${
              heading.level === 2 ? "ml-4" : ""
            } text-sm text-gray-700 hover:text-gray-900`}
          >
            <Link
              href={`#${heading.id}`}
              scroll={false}
              onClick={(e) => {
                e.preventDefault();
                window.history.replaceState(null, "", `#${heading.id}`);
                handleClick(heading.id);
              }}
              className="block"
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
