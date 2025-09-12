import TimeIcon from "@/icon/time.svg";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
import MdxSideBar from "@/components/MdxSideBar";
import Link from "next/link";
import RightArrow from "@/icon/arrow_right.svg";
import LeftArrow from "@/icon/arrow_left.svg";
import dynamic from "next/dynamic";
import DoubleArrow from "@/icon/arrow_right_double.svg";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Image from "next/image";
import { DEFAULT_POST_THUMBNAIL } from "@/constants/basic.constants";
import { getTagPath } from "@/utils/path";
import dayjs from "dayjs";
import MdxAnimation from "./MdxAnimation";

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
  frontMatter: { title, createdAt, description, tags, thumbnail },
  readingTime,
  heading = [],
  previousPost,
  nextPost,
  relatedPosts,
}: MdxDetailTemplateProps) => {
  const isoDate = dayjs(createdAt, "YYYY.MM.DD").isValid()
    ? dayjs(createdAt, "YYYY.MM.DD").format("YYYY-MM-DD")
    : new Date().toISOString().split("T")[0];

  // const MdxContent = useMemo(() => {
  //   return (
  //     <MDXRemote
  //       source={source}
  //       components={{
  //         code: ({ className, children }) => (
  //           <CodeBlock
  //             hasCopyBtn={className?.includes("block-code")}
  //             className={className}
  //           >
  //             {children}
  //           </CodeBlock>
  //         ),
  //         a: ({ children, href, target = "_blank" }) => (
  //           <MdxLink href={href} target={target}>
  //             {children}
  //           </MdxLink>
  //         ),
  //         p: ({ children, ...rest }) => (
  //           <AnimationContainer htmlTag="p" {...rest}>
  //             {children}
  //           </AnimationContainer>
  //         ),
  //         h1: ({ children, ...rest }) => (
  //           <AnimationContainer htmlTag="h1" {...rest}>
  //             {children}
  //           </AnimationContainer>
  //         ),
  //         h2: ({ children, ...rest }) => (
  //           <AnimationContainer htmlTag="h2" {...rest}>
  //             {children}
  //           </AnimationContainer>
  //         ),
  //         h3: ({ children, ...rest }) => (
  //           <AnimationContainer htmlTag="h3" {...rest}>
  //             {children}
  //           </AnimationContainer>
  //         ),
  //         ul: ({ children, ...rest }) => (
  //           <AnimationContainer htmlTag="ul" {...rest}>
  //             {children}
  //           </AnimationContainer>
  //         ),
  //         li: ({ children, ...rest }) => (
  //           <AnimationContainer htmlTag="li" {...rest}>
  //             {children}
  //           </AnimationContainer>
  //         ),
  //         ...(mdxComponents || {}),
  //       }}
  //     />
  //   );
  // }, [source]);
  const postThumbnail = thumbnail ?? DEFAULT_POST_THUMBNAIL;

  return (
    <>
      <MdxAnimation />
      <ScrollProgressBar />
      <header className="border-b border-b-[var(--border-color)] mb-4 pb-4">
        <h1 className="text-4xl font-bold mb-1">{title}</h1>
        <p className="text-gray-400 text-xl mb-3">{description}</p>

        <section className="flex items-center gap-3 mb-3 text-gray-400">
          <time dateTime={isoDate}>{createdAt}</time>
          <div className="flex items-center gap-[2px]">
            <TimeIcon style={{ width: 14, height: 14 }} stroke="black" />
            <p>{readingTime}</p>
            <span>분</span>
          </div>
        </section>
        {!!tags?.length && (
          <section className="flex items-center gap-2">
            {tags.map((tagItem, idx) => (
              <Link
                href={getTagPath(tagItem)}
                key={`${tagItem}_${idx}`}
                className="text-primary hover:text-primary-hover transition-colors duration-300"
              >
                #{tagItem}
              </Link>
            ))}
          </section>
        )}
      </header>
      <div className="flex items-center justify-center">
        {postThumbnail && (
          <Image
            src={postThumbnail}
            alt={title}
            width={500}
            height={500}
            className="rounded-md"
            loading="lazy"
          />
        )}
      </div>

      <MdxSideBar headings={heading} />
      <section className="relative border-b py-5">
        <article
          className="markdown-contents"
          dangerouslySetInnerHTML={{ __html: source }}
        ></article>
      </section>

      {(previousPost || nextPost) && (
        <section className="my-4">
          <div className="flex justify-between text-sm text-gray-400">
            <div className="w-1/2">
              {previousPost && (
                <button className="group flex flex-col items-start">
                  <div className="flex items-center group-hover:text-theme">
                    <LeftArrow style={{ width: 16, height: 16 }} />
                    <span>Previous</span>
                  </div>
                  <Link
                    className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5"
                    href={`/posts/${previousPost.slug}`}
                  >
                    {previousPost.title}
                  </Link>
                </button>
              )}
            </div>
            <div className="w-1/2">
              {nextPost && (
                <button className="group flex flex-col items-end ml-auto">
                  <div className="flex items-center group-hover:text-theme">
                    <span>Next</span>
                    <RightArrow style={{ width: 16, height: 16 }} />
                  </div>
                  <Link
                    className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5"
                    href={`/posts/${nextPost.slug}`}
                  >
                    {nextPost.title}
                  </Link>
                </button>
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
                    <button
                      key={slug}
                      className="group flex flex-col items-end"
                    >
                      <Link
                        className="group-hover:text-theme group-hover:bg-gray-100/5 rounded-sm p-0.5 underline underline-offset-4"
                        href={`/posts/${slug}`}
                      >
                        {title}
                      </Link>
                    </button>
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
