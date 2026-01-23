import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxSideBar from "@/components/MdxSideBar";
import Link from "next/link";
import RightArrow from "@/icon/arrow_right.svg";
import LeftArrow from "@/icon/arrow_left.svg";
import dynamic from "next/dynamic";
import DoubleArrow from "@/icon/arrow_right_double.svg";
import TimeIcon from "@/icon/time.svg";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Image from "next/image";
import { DEFAULT_POST_THUMBNAIL } from "@/constants/basic.constants";
import { formatTagDisplay, getTagPath } from "@/utils/tag";
import dayjs from "dayjs";
import MdxAnimation from "./MdxAnimation";
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
  relatedPosts: MdxDetailRelatedPost[] | null;
}

const MdxDetailTemplate = ({
  source,
  frontMatter: { title, createdAt, tags, thumbnail, category, subCategory },
  readingTime,
  heading = [],
  previousPost,
  nextPost,
  relatedPosts,
}: MdxDetailTemplateProps) => {
  const isoDate = dayjs(createdAt, "YYYY.MM.DD").isValid()
    ? dayjs(createdAt, "YYYY.MM.DD").format("YYYY-MM-DD")
    : new Date().toISOString().split("T")[0];

  const categoryLabel = subCategory || category;

  const postThumbnail = thumbnail ?? DEFAULT_POST_THUMBNAIL;

  return (
    <>
      <MdxAnimation />
      <ScrollProgressBar />

      {/* 헤더 섹션 */}
      <header className="mb-10">
        {/* 카테고리 · 날짜 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            {categoryLabel}
          </span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <time
            dateTime={isoDate}
            className="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide"
          >
            {dayjs(createdAt, "YYYY.MM.DD").format("MMM D, YYYY")}
          </time>
        </div>

        {/* 제목 */}
        <h1 className="text-3xl tablet:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
          {title}
        </h1>

        {/* 작성자 정보 */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
              <Image
                src="https://github.com/HyeongSeoku.png"
                alt="김형석"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                김형석
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Frontend Developer
              </p>
            </div>
          </div>
        </div>

        {/* 메타 정보 (읽기 시간, 태그) */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <span>{createdAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <TimeIcon className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* 태그 */}
          {!!tags?.length && (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tagItem, idx) => (
                <Link
                  href={getTagPath(tagItem)}
                  key={`${tagItem}_${idx}`}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  #{formatTagDisplay(tagItem)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 히어로 이미지 */}
        {postThumbnail && (
          <div className="w-full aspect-[4/3] tablet:aspect-[16/9] relative overflow-hidden rounded-xl">
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

      <MdxSideBar headings={heading} />
      <section className="relative py-5 border-b border-gray-200 dark:border-gray-700">
        <ParsePostContent html={source} />
      </section>

      {(previousPost || nextPost) && (
        <section className="my-4">
          <div className="flex justify-between text-sm text-gray-400">
            <div className="w-1/2">
              {previousPost && (
                <Link
                  href={`/posts/${previousPost.slug}`}
                  className="group flex flex-col items-start"
                >
                  <div className="flex items-center group-hover:text-theme">
                    <LeftArrow style={{ width: 16, height: 16 }} />
                    <span>Previous</span>
                  </div>
                  <span className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5">
                    {previousPost.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="w-1/2">
              {nextPost && (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="group flex flex-col items-end ml-auto"
                >
                  <div className="flex items-center group-hover:text-theme">
                    <span>Next</span>
                    <RightArrow style={{ width: 16, height: 16 }} />
                  </div>
                  <span className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-3">
            {!!relatedPosts && !!relatedPosts.length && (
              <div className="text-gray-400">
                <div className="flex items-center text-sm">
                  <span>Related Posts</span>
                  <DoubleArrow style={{ width: 16, height: 16 }} />
                </div>
                <ul className="text-sm">
                  {relatedPosts.map(({ slug, title }) => (
                    <li key={slug}>
                      <Link
                        className="group hover:text-theme hover:bg-gray-100/5 rounded-sm p-0.5 underline underline-offset-4"
                        href={`/posts/${slug}`}
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <Giscus />
    </>
  );
};

export default MdxDetailTemplate;
