"use client";

import CodeBlock from "@/components/CodeBlock";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxLink from "@/components/MdxLink";
import MdxSideBar from "@/components/MdxSideBar";

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
  heading?: HeadingsProps[];
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, description, subCategory, tags },
  readingTime,
  heading = [],
}: MdxDetailTemplateProps) => {
  return (
    <div className="flex">
      {/* 사이드바 추가 */}
      <MdxSideBar headings={heading} />
      <main className="flex-1">
        <header className="border-b border-b-[var(--border-color)] mb-4 pb-4">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="text-[var(--gray2-text-color)] text-xl">
            {description}
          </p>
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
              a: ({ children, href, target = "_blank" }) => (
                <MdxLink href={href} target={target}>
                  {children}
                </MdxLink>
              ),
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default MdxDetailTemplate;
