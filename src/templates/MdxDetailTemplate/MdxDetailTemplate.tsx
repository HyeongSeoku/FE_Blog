"use client";

import CodeBlock from "@/components/CodeBlock";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxLink from "@/components/MdxLink";
import MdxSideBar from "@/components/MdxSideBar";
import AnimationContainer from "@/components/AnimationContainer";
import Giscus from "@/components/Giscus";
import { useRef } from "react";

type MdxDetailRelatedPost = { slug: string; headings: HeadingsProps[] };

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
  heading?: HeadingsProps[];
  previousPost: MdxDetailRelatedPost | null;
  nextPost: MdxDetailRelatedPost | null;
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, description, category, subCategory, tags },
  readingTime,
  heading = [],
}: MdxDetailTemplateProps) => {
  const commentRef = useRef<HTMLElement>(null);

  return (
    <>
      <header className="border-b border-b-[var(--border-color)] mb-4 pb-4">
        <h1 className="text-4xl font-bold mb-1">{title}</h1>
        <p className="text-[var(--gray2-text-color)] text-xl mb-3">
          {description}
        </p>
        <section className="flex items-center gap-3 mb-3">
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
      <MdxSideBar headings={heading} commentRef={commentRef} />

      <section className="relative">
        <article className="markdown-contents">
          <MDXRemote
            {...source}
            components={{
              code: ({ className, children }) => (
                <CodeBlock
                  hasCopyBtn={className?.includes("block-code")}
                  className={className}
                >
                  {children}
                </CodeBlock>
              ),
              a: ({ children, href, target = "_blank" }) => (
                <MdxLink href={href} target={target}>
                  {children}
                </MdxLink>
              ),
              p: ({ children, ...rest }) => (
                <AnimationContainer tag="p" {...rest}>
                  {children}
                </AnimationContainer>
              ),
              h1: ({ children, ...rest }) => (
                <AnimationContainer tag="h1" {...rest}>
                  {children}
                </AnimationContainer>
              ),
              h2: ({ children, ...rest }) => (
                <AnimationContainer tag="h2" {...rest}>
                  {children}
                </AnimationContainer>
              ),
              h3: ({ children, ...rest }) => (
                <AnimationContainer tag="h3" {...rest}>
                  {children}
                </AnimationContainer>
              ),
              ul: ({ children, ...rest }) => (
                <AnimationContainer tag="ul" {...rest}>
                  {children}
                </AnimationContainer>
              ),
              li: ({ children, ...rest }) => (
                <AnimationContainer tag="li" {...rest}>
                  {children}
                </AnimationContainer>
              ),
            }}
          />
        </article>
      </section>

      <section ref={commentRef}>
        <Giscus />
      </section>
    </>
  );
};

export default MdxDetailTemplate;
