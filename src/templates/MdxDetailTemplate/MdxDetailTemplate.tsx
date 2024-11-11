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
        <div className="flex items-center gap-3">
          <time className="text-[--gray-text-color]">{createdAt}</time>
          <div>
            <time>{readingTime}</time>
            <span>분</span>
          </div>
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
