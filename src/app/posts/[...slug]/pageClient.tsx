"use client";

import dynamic from "next/dynamic";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

interface PostPageProps {
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

export default function PostPageClient({ source, frontMatter }: PostPageProps) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...source} />
    </div>
  );
}
