"use client";

import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";
import { Suspense } from "react";

interface ProjectPageDetailClientProps {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

export default function ProjectDetailPageClient({
  source,
  frontMatter,
}: ProjectPageDetailClientProps) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <Suspense fallback={<p>Loading content...</p>}>
        <MDXRemote {...source} />
      </Suspense>
    </div>
  );
}
