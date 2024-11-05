"use client";

import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";

interface PostPageMainProps {
  source: MDXRemoteSerializeResult;
}

export default function PostPageMainClient({ source }: PostPageMainProps) {
  return (
    <section className="markdown-contents">
      <MDXRemote {...source} />
    </section>
  );
}
