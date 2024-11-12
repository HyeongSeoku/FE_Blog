"use client";

import CodeBlock from "@/components/shared/CodeBlock";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps } from "@/types/mdx";

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, description, subCategory, tags },
  readingTime,
}: MdxDetailTemplateProps) => {
  return (
    <>
      <header>
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="text-[var(--gray2-text-color)] text-xl">{description}</p>
        <section className="flex items-center gap-3 mt-2 mb-2">
          <time className="text-[--gray2-text-color]">{createdAt}</time>
          <div className="flex items-center gap-[2px]">
            <TimeIcon width={14} height={14} stroke="black" />
            <time>{readingTime}</time>
            <span>분</span>
          </div>
        </section>
        {!!tags?.length && (
          <section className="flex items-center gap-2">
            {tags.map((tagItem, idx) => (
              <div key={`${tagItem}_${idx}`}>{tagItem}</div>
            ))}
          </section>
        )}
      </header>
      <section className="markdown-contents">
        <MDXRemote
          {...source}
          components={{
            code: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          }}
        />
      </section>
    </>
  );
};

export default MdxDetailTemplate;
