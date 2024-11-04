"use client";

import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";

interface PostPageMainProps {
  source: MDXRemoteSerializeResult;
}

export default function PostPageMainClient({ source }: PostPageMainProps) {
  return <MDXRemote {...source} />;
}
