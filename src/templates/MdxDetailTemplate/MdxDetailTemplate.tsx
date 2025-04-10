"use client";

import CodeBlock from "@/components/CodeBlock";
import { MDXRemoteProps, MDXRemoteSerializeResult } from "next-mdx-remote";
import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxLink from "@/components/MdxLink";
import MdxSideBar from "@/components/MdxSideBar";
import AnimationContainer from "@/components/AnimationContainer";
import Giscus from "@/components/Giscus";
import { useMemo, useRef } from "react";
import Link from "next/link";
import RightArrow from "@/icon/arrow_right.svg";
import LeftArrow from "@/icon/arrow_left.svg";
import dynamic from "next/dynamic";
import DoubleArrow from "@/icon/arrow_right_double.svg";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import classNames from "classnames";
import useScrollPosition from "@/hooks/useScrollPosition";
import SkeletonBar from "@/components/SkeletonBar";
import Image from "next/image";
import { DEFAULT_POST_THUMBNAIL } from "@/constants/basic.constants";
import { getTagPath } from "@/utils/path";

// MDXRemote를 동적으로 import
const MDXRemote = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-40 py-5 flex flex-col gap-2">
        <SkeletonBar className="!w-1/5 !h-10 md:!w-1/3" />
        <SkeletonBar />
        <SkeletonBar />
        <SkeletonBar className="!w-1/3 !h-8 md:!w-1/2 mt-4" />
        <SkeletonBar />
        <SkeletonBar />
        <SkeletonBar />

        <SkeletonBar className="!w-1/3 !h-8 md:!w-1/2 mt-4" />
        <SkeletonBar />
        <SkeletonBar />
      </div>
    ),
  },
);

type MdxDetailRelatedPost = {
  slug: string;
  title: string;
};

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
  heading?: HeadingsProps[];
  previousPost: MdxDetailRelatedPost | null;
  nextPost: MdxDetailRelatedPost | null;
  relatedPosts: MdxDetailRelatedPost[] | null;
  mdxComponents?: MDXRemoteProps["components"];
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, description, tags, thumbnail },
  readingTime,
  heading = [],
  previousPost,
  nextPost,
  relatedPosts,
  mdxComponents,
}: MdxDetailTemplateProps) => {
  const commentRef = useRef<HTMLElement>(null);
  const { isScrollTop } = useScrollPosition();
  const MdxContent = useMemo(() => {
    return (
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
            <AnimationContainer htmlTag="p" {...rest}>
              {children}
            </AnimationContainer>
          ),
          h1: ({ children, ...rest }) => (
            <AnimationContainer htmlTag="h1" {...rest}>
              {children}
            </AnimationContainer>
          ),
          h2: ({ children, ...rest }) => (
            <AnimationContainer htmlTag="h2" {...rest}>
              {children}
            </AnimationContainer>
          ),
          h3: ({ children, ...rest }) => (
            <AnimationContainer htmlTag="h3" {...rest}>
              {children}
            </AnimationContainer>
          ),
          ul: ({ children, ...rest }) => (
            <AnimationContainer htmlTag="ul" {...rest}>
              {children}
            </AnimationContainer>
          ),
          li: ({ children, ...rest }) => (
            <AnimationContainer htmlTag="li" {...rest}>
              {children}
            </AnimationContainer>
          ),
          ...(mdxComponents || {}),
        }}
      />
    );
  }, [source]);
  const postThumbnail = thumbnail ?? DEFAULT_POST_THUMBNAIL;

  return (
    <>
      <div
        className={classNames(
          "fixed left-0 right-0 z-10 h-1 transition-[top,opacity] duration-300",
          {
            "top-0 opacity-1": !isScrollTop,
            "-top-14 opacity-0": isScrollTop,
          },
        )}
      >
        <ScrollProgressBar />
      </div>
      <header className="border-b border-b-[var(--border-color)] mb-4 pb-4">
        <h1 className="text-4xl font-bold mb-1">{title}</h1>
        <p className="text-gray-400 text-xl mb-3">{description}</p>

        <section className="flex items-center gap-3 mb-3 text-gray-400">
          <time>{createdAt}</time>
          <div className="flex items-center gap-[2px]">
            <TimeIcon style={{ width: 14, height: 14 }} stroke="black" />
            <time>{readingTime}</time>
            <span>분</span>
          </div>
        </section>
        {!!tags?.length && (
          <section className="flex items-center gap-2">
            {tags.map((tagItem, idx) => (
              <Link
                href={getTagPath(tagItem)}
                key={`${tagItem}_${idx}`}
                className="text-primary hover:text-primary-hover transition-colors duration-300"
              >
                #{tagItem}
              </Link>
            ))}
          </section>
        )}
      </header>
      <div className="flex items-center justify-center">
        <Image
          src={postThumbnail}
          alt={title}
          width={500}
          height={500}
          className="rounded-md"
          loading="lazy"
        />
      </div>

      <MdxSideBar headings={heading} commentRef={commentRef} />

      <section className="relative border-b py-5">
        <article className="markdown-contents">{MdxContent}</article>
      </section>

      {(previousPost || nextPost) && (
        <section className="my-4">
          <div className="flex justify-between text-sm text-gray-400">
            <div className="w-1/2">
              {previousPost && (
                <button className="group flex flex-col items-start">
                  <div className="flex items-center group-hover:text-theme">
                    <LeftArrow style={{ width: 16, height: 16 }} />
                    <span>Previous</span>
                  </div>
                  <Link
                    className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5"
                    href={`/posts/${previousPost.slug}`}
                  >
                    {previousPost.title}
                  </Link>
                </button>
              )}
            </div>
            <div className="w-1/2">
              {nextPost && (
                <button className="group flex flex-col items-end ml-auto">
                  <div className="flex items-center group-hover:text-theme">
                    <span>Next</span>
                    <RightArrow style={{ width: 16, height: 16 }} />
                  </div>
                  <Link
                    className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5"
                    href={`/posts/${nextPost.slug}`}
                  >
                    {nextPost.title}
                  </Link>
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            {!!relatedPosts && !!relatedPosts.length && (
              <div className="text-gray-400">
                <div className="flex items-center text-sm">
                  <span>Related Posts</span>
                  <DoubleArrow style={{ width: 16, height: 16 }} />
                </div>
                <ul className="text-sm">
                  {relatedPosts.map(({ slug, title }) => (
                    <button
                      key={slug}
                      className="group flex flex-col items-end"
                    >
                      <Link
                        className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5 underline underline-offset-4"
                        href={`/posts/${slug}`}
                      >
                        {title}
                      </Link>
                    </button>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section ref={commentRef}>
        <Giscus />
      </section>
    </>
  );
};

export default MdxDetailTemplate;
