import { HeadingsProps } from "@/types/mdx";

export interface MdxSideBarProps {
  headings: HeadingsProps[];
}

const MdxSideBar = ({ headings }: MdxSideBarProps) => {
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
            <a href={`#${heading.id}`} className="block">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MdxSideBar;
