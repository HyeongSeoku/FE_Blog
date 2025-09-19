import { notFound } from "next/navigation";
import { getAllPosts, getPostsDetail } from "@/utils/post";
import {
  BASE_META_TITLE,
  BASE_URL,
  PUBLIC_CONTENT_IMG_PATH,
} from "@/constants/basic.constants";
import { getStructuredData } from "@/utils/structure";
import { FrontMatterProps } from "@/types/mdx";
import MdxDetailTemplate from "@/templates/MdxDetailTemplate/MdxDetailTemplate";

export const dynamic = "error";

export async function generateStaticParams() {
  const { postList } = await getAllPosts({});
  return postList.map((post) => ({ slug: post.slug.split("/") }));
}

async function getPostDataWithMetadata(slug: string[]) {
  const postData = await getPostsDetail(slug);

  if (!postData) {
    return {
      postData: null,
      metadata: {
        title: "게시글을 찾을 수 없습니다",
        description: "요청하신 게시글이 존재하지 않습니다.",
        other: { keyword: "" },
      },
    };
  }

  const { frontMatter } = postData;

  const metadata = {
    title: frontMatter.title || BASE_META_TITLE,
    description:
      frontMatter.description ||
      "프론트엔드 개발자 김형석의 개발 블로그입니다.",
    other: { keyword: frontMatter.tags?.join(",") || "" },
    openGraph: {
      title: frontMatter.title || BASE_META_TITLE,
      description:
        frontMatter.description ||
        "프론트엔드 개발자 김형석의 개발 블로그입니다.",
      url: `${BASE_URL}/posts/${slug.join("/")}`,
      type: "article",
      images: [
        {
          url:
            frontMatter.thumbnail ||
            `${PUBLIC_CONTENT_IMG_PATH}/default-og-image.webp`,
          alt: frontMatter.title || BASE_META_TITLE,
        },
      ],
      article: {
        publishedTime: frontMatter.createdAt,
        modifiedTime: frontMatter.createdAt,
        authors: ["김형석"],
        tags: frontMatter.tags ?? [],
      },
    },
  };

  return { postData, metadata };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  const { metadata, postData } = await getPostDataWithMetadata(params.slug);
  if (!postData) return metadata;

  return {
    ...metadata,
    alternates: {
      canonical: `${BASE_URL}/posts/${params.slug.join("/")}`,
    },
  };
}

function getPostsStructuredData(
  slug: string[],
  frontMatter: FrontMatterProps,
  readingWords?: number,
) {
  const postUrl = `${BASE_URL}/posts/${slug.join("/")}`;

  const blogPosting = getStructuredData({
    type: "BlogPosting",
    headline: frontMatter.title ?? BASE_META_TITLE,
    description: frontMatter.description ?? "프론트엔드 개발자 김형석의 블로그",
    image:
      frontMatter.thumbnail ?? `${PUBLIC_CONTENT_IMG_PATH}/default_image.webp`,
    author: { type: "Person", name: "김형석", url: `${BASE_URL}/about` },
    publisher: {
      type: "Organization",
      name: BASE_META_TITLE,
      url: BASE_URL,
      logo: { url: `${BASE_URL}/image/logo.svg`, width: 256, height: 256 },
    },
    datePublished: frontMatter.createdAt,
    dateModified: frontMatter.createdAt,
    url: postUrl,
    mainEntityOfPage: { id: postUrl },
    inLanguage: "ko-KR",
    keywords: frontMatter.tags ?? [],
    articleSection: frontMatter.category ?? "Tech",
    wordCount: typeof readingWords === "number" ? readingWords : undefined,
  });

  const breadcrumbs = getStructuredData({
    type: "BreadcrumbList",
    itemListElement: [
      { position: 1, name: "Home", item: BASE_URL },
      { position: 2, name: "Posts", item: `${BASE_URL}/posts` },
      { position: 3, name: frontMatter.title ?? "Post", item: postUrl },
    ],
  });

  return { blogPosting, breadcrumbs };
}

const PostPage = async ({ params }: { params: { slug: string[] } }) => {
  const postData = await getPostsDetail(params.slug);

  if (!postData) {
    return notFound();
  }

  const {
    source,
    frontMatter,
    readingTime,
    heading,
    nextPost,
    previousPost,
    relatedPosts,
  } = postData;

  const { blogPosting, breadcrumbs } = getPostsStructuredData(
    params.slug,
    frontMatter,
    typeof readingTime === "number" ? readingTime : undefined,
  );

  return (
    <>
      <MdxDetailTemplate
        source={source}
        readingTime={readingTime}
        frontMatter={frontMatter}
        heading={heading}
        nextPost={nextPost}
        previousPost={previousPost}
        relatedPosts={relatedPosts}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
};

export default PostPage;
