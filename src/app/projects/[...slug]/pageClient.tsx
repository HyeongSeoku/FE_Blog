"use client";

import dynamic from "next/dynamic";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

interface ProjectPageDetailClientProps {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

const MDXRemote = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  {
    ssr: false,
  },
);

export default function ProjectDetailPageClient({
  source,
  frontMatter,
}: ProjectPageDetailClientProps) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...source} />
    </div>
  );
}
