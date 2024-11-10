"use client";

import CodeBlock from "@/components/shared/CodeBlock";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  readingTime?: number;
  title?: string;
  createdAt?: string;
}

const MdxDetailTemplate = ({
  source,
  title,
  createdAt,
  readingTime,
}: MdxDetailTemplateProps) => {
  return (
    <>
      <header>
        <h1 className="text-5xl font-bold">{title}</h1>
        <div>{createdAt}</div>
        <div>
          <time>{readingTime}</time>
          <span>분</span>
        </div>
      </header>
      <section className="markdown-contents">
        <MDXRemote
          {...source}
          components={{
            code: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          }}
        />
      </section>
    </>
  );
};

export default MdxDetailTemplate;
