import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import MdxToc from "@/components/MdxToc";
import ShareButton from "@/components/ShareButton";
import { DEFAULT_POST_THUMBNAIL } from "@/constants/basic.constants";
import LeftArrow from "@/icon/arrow_left.svg";
import RightArrow from "@/icon/arrow_right.svg";
import type { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import { formatTagDisplay, getTagPath } from "@/utils/tag";
import { ParsePostContent } from "./ParsePostContent";

const Giscus = dynamic(() => import("@/components/Giscus"), {
  ssr: false,
});

type MdxDetailRelatedPost = {
  slug: string;
  title: string;
};

interface MdxDetailTemplateProps {
  source: string;
  frontMatter: FrontMatterProps;
  readingTime?: number;
  heading?: HeadingsProps[];
  previousPost: MdxDetailRelatedPost | null;
  nextPost: MdxDetailRelatedPost | null;
}

const MdxDetailTemplate = ({
  source,
  frontMatter: {
    title,
    createdAt,
    tags,
    thumbnail,
    category,
    subCategory,
    endnote,
  },
  readingTime,
  heading = [],
  previousPost,
  nextPost,
}: MdxDetailTemplateProps) => {
  const parsedDate = dayjs(createdAt, "YYYY.MM.DD");
  const isoDate = parsedDate.isValid()
    ? parsedDate.format("YYYY-MM-DD")
    : new Date().toISOString().split("T")[0];
  const displayDate = parsedDate.isValid()
    ? parsedDate.format("YYYY. MM. DD")
    : createdAt;

  const postThumbnail = thumbnail ?? DEFAULT_POST_THUMBNAIL;

  return (
    <>
      {/* 헤더 섹션 */}
      <header className="mb-sk-section-lg flex flex-col gap-4">
        <h1 className="text-sk-h1 font-bold text-theme">{title}</h1>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sk-meta text-muted">
          <span>{category}</span>
          {subCategory && (
            <>
              <span>·</span>
              <span>{subCategory}</span>
            </>
          )}
          <span>·</span>
          <time dateTime={isoDate}>{displayDate}</time>
          {!!readingTime && (
            <>
              <span>·</span>
              <span>{readingTime}분 읽기</span>
            </>
          )}
        </div>

        {!!tags?.length && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {tags.map((tagItem) => (
              <Link
                href={getTagPath(tagItem)}
                key={tagItem}
                className="text-sk-label text-muted transition-opacity hover:opacity-[.55]"
              >
                #{formatTagDisplay(tagItem)}
              </Link>
            ))}
          </div>
        )}

        {postThumbnail && (
          <div
            className="relative w-full overflow-hidden rounded-sk-image"
            style={{ height: "var(--sk-hero-image)" }}
          >
            <Image
              src={postThumbnail}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <MdxToc headings={heading} />

      <section className="markdown-contents-wrapper">
        <ParsePostContent html={source} />
      </section>

      {endnote && (
        <section className="mt-sk-section-lg flex flex-col gap-2">
          <h2 className="text-sk-label text-muted">Endnote</h2>
          <p className="text-sk-body leading-[var(--sk-line-intro)] text-muted">
            {endnote}
          </p>
        </section>
      )}

      <section className="mt-sk-section-lg flex justify-end">
        <ShareButton />
      </section>

      {(previousPost || nextPost) && (
        <section className="mt-6 flex items-start justify-between gap-4 border-t border-hairline pt-6 text-sk-meta">
          <div className="flex-1">
            {previousPost && (
              <Link
                href={`/posts/${previousPost.slug}`}
                className="group flex flex-col items-start gap-1 transition-opacity hover:opacity-[.55]"
              >
                <span className="flex items-center gap-1 text-muted">
                  <LeftArrow style={{ width: 14, height: 14 }} />
                  이전 글
                </span>
                <span className="text-theme">{previousPost.title}</span>
              </Link>
            )}
          </div>
          <div className="flex-1 text-right">
            {nextPost && (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group ml-auto flex flex-col items-end gap-1 transition-opacity hover:opacity-[.55]"
              >
                <span className="flex items-center gap-1 text-muted">
                  다음 글
                  <RightArrow style={{ width: 14, height: 14 }} />
                </span>
                <span className="text-theme">{nextPost.title}</span>
              </Link>
            )}
          </div>
        </section>
      )}

      <Giscus />
    </>
  );
};

export default MdxDetailTemplate;
