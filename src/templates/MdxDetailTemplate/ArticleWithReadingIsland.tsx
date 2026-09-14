"use client";

import { useRef } from "react";
import MobileReadingIsland from "@/components/MobileReadingIsland";
import type { HeadingsProps } from "@/types/mdx";
import { ParsePostContent } from "./ParsePostContent";

interface ArticleWithReadingIslandProps {
  title: string;
  source: string;
  headings: HeadingsProps[];
}

const ArticleWithReadingIsland = ({
  title,
  source,
  headings,
}: ArticleWithReadingIslandProps) => {
  const articleRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className="markdown-contents-wrapper" ref={articleRef}>
        <ParsePostContent html={source} />
      </section>
      <MobileReadingIsland
        title={title}
        headings={headings}
        articleRef={articleRef}
      />
    </>
  );
};

export default ArticleWithReadingIsland;
