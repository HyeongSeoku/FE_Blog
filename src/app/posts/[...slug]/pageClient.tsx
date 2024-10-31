"use client";

import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";
import { Suspense } from "react";

interface PostPageProps {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

export default function PostPageClient({ source, frontMatter }: PostPageProps) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <Suspense fallback={<p>Loading content...</p>}>
        <MDXRemote {...source} />
      </Suspense>
    </div>
  );
}
