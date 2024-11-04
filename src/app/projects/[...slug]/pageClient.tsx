"use client";

import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";

interface ProjectPageDetailClientProps {
  source: MDXRemoteSerializeResult;
}

export default function ProjectDetailPageClient({
  source,
}: ProjectPageDetailClientProps) {
  return <MDXRemote {...source} />;
}
