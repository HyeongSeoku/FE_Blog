"use client";

import CodeBlock from "@/components/CodeBlock";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxLink from "@/components/MdxLink";
import MdxSideBar from "@/components/MdxSideBar"; // 사이드바 컴포넌트 추가
import { useEffect, useRef, useState } from "react"; // 상태 관리를 위해 추가

interface MdxDetailTemplateProps {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, description, subCategory, tags },
  readingTime,
}: MdxDetailTemplateProps) => {
  const [headings, setHeadings] = useState<HeadingsProps[]>([]);
  const headingsRef = useRef<HeadingsProps[]>([]);
  const headingIds = new Set<string>();

  const generateUniqueId = (text: string, existingIds: Set<string>) => {
    const baseId = text.trim().replace(/\s+/g, "-").toLowerCase();
    let uniqueId = baseId;
    let counter = 1;

    // 중복 id 확인 후 고유 id 생성
    while (existingIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }
    existingIds.add(uniqueId);
    return uniqueId;
  };

  const handleHeading = (id: string, text: string, level: number) => {
    headingsRef.current = [...headingsRef.current, { id, text, level }];
  };

  useEffect(() => {
    setHeadings(headingsRef.current); // headings 상태를 업데이트
  }, [source]); // source 변경 시 갱신

  console.log("TEST TEMPLATE", source);

  return (
    <div className="flex">
      {/* 사이드바 추가 */}
      <MdxSideBar headings={headings} />
      <main className="flex-1">
        <header className="border-b border-b-[var(--border-color)] mb-4 pb-4">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="text-[var(--gray2-text-color)] text-xl">
            {description}
          </p>
          <section className="flex items-center gap-3 mt-2 mb-2">
            <time className="text-[--gray2-text-color]">{createdAt}</time>
            <div className="flex items-center gap-[2px]">
              <TimeIcon width={14} height={14} stroke="black" />
              <time>{readingTime}</time>
              <span>분</span>
            </div>
          </section>
          {!!tags?.length && (
            <section className="flex items-center gap-2">
              {tags.map((tagItem, idx) => (
                <div key={`${tagItem}_${idx}`}>{tagItem}</div>
              ))}
            </section>
          )}
        </header>
        <section className="markdown-contents">
          <MDXRemote
            {...source}
            components={{
              h1: ({ children }) => {
                const id = generateUniqueId(String(children), headingIds);
                handleHeading(id, String(children), 1); // h1 데이터 추가
                return <h1 id={id}>{children}</h1>;
              },
              h2: ({ children }) => {
                const id = generateUniqueId(String(children), headingIds);
                handleHeading(id, String(children), 2); // h2 데이터 추가
                return <h2 id={id}>{children}</h2>;
              },

              code: ({ children }) => <CodeBlock>{children}</CodeBlock>,
              a: ({ children, href, target = "_blank" }) => (
                <MdxLink href={href} target={target}>
                  {children}
                </MdxLink>
              ),
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default MdxDetailTemplate;
