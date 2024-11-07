"use client";

import CodeBlock from "@/components/shared/CodeBlock";
import { MDXRemoteSerializeResult, MDXRemote } from "next-mdx-remote";

interface PostPageMainProps {
  source: MDXRemoteSerializeResult;
}

export default function PostPageMainClient({ source }: PostPageMainProps) {
  return (
    <section className="markdown-contents">
      <MDXRemote
        {...source}
        components={{
          code: ({ children }) => <CodeBlock>{children}</CodeBlock>,
        }}
      />
    </section>
  );
}
