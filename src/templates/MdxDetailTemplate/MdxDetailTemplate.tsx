"use client";

import CodeBlock from "@/components/CodeBlock";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxLink from "@/components/MdxLink";
import MdxSideBar from "@/components/MdxSideBar";
import AnimationContainer from "@/components/AnimationContainer";

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
  heading?: HeadingsProps[];
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, description, category, subCategory, tags },
  readingTime,
  heading = [],
}: MdxDetailTemplateProps) => {
  return (
    <>
      <header className="border-b border-b-[var(--border-color)] mb-4 pb-4">
        <h1 className="text-4xl font-bold">{title}</h1>
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
      <MdxSideBar headings={heading} />

      <section className="relative">
        <article className="markdown-contents">
          <MDXRemote
            {...source}
            components={{
              code: ({ children }) => <CodeBlock>{children}</CodeBlock>,
              a: ({ children, href, target = "_blank" }) => (
                <MdxLink href={href} target={target}>
                  {children}
                </MdxLink>
              ),
              p: ({ children }) => (
                <AnimationContainer tag="p">{children}</AnimationContainer>
              ),
              h1: ({ children }) => (
                <AnimationContainer tag="h1">{children}</AnimationContainer>
              ),
              h2: ({ children }) => (
                <AnimationContainer tag="h2">{children}</AnimationContainer>
              ),
              h3: ({ children }) => (
                <AnimationContainer tag="h3">{children}</AnimationContainer>
              ),
              ul: ({ children }) => (
                <AnimationContainer tag="ul">{children}</AnimationContainer>
              ),
              li: ({ children }) => (
                <AnimationContainer tag="li">{children}</AnimationContainer>
              ),
            }}
          />
        </article>
      </section>
    </>
  );
};

export default MdxDetailTemplate;
