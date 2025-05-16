import { redirect } from "next/navigation";
import { getAllPosts, getPostsDetail } from "@/utils/post";
import MdxDetailTemplate from "@/templates/MdxDetailTemplate/MdxDetailTemplate";
import SkeletonBar from "@/components/SkeletonBar";

import MdxComponentWrapper from "@/components/MDX/MdxComponentWrapper";
import {
  BASE_META_TITLE,
  BASE_URL,
  PUBLIC_CONTENT_IMG_PATH,
} from "@/constants/basic.constants";

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
      url: `/posts/${slug.join("/")}`,
      type: "website",
      images: [
        {
          url:
            frontMatter.thumbnail ||
            `${PUBLIC_CONTENT_IMG_PATH}/default-og-image.jpeg`,
          alt: frontMatter.title || BASE_META_TITLE,
        },
      ],
    },
  };

  return { postData, metadata };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  const { metadata } = await getPostDataWithMetadata(params.slug);

  return {
    ...metadata,
    alternates: {
      canonical: `${BASE_URL}/posts/${params.slug.join("/")}`,
    },
  };
}

const PostPage = async ({ params }: { params: { slug: string[] } }) => {
  const postData = await getPostsDetail(params.slug);

  if (!postData) {
    redirect("/not-found");
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontMatter.title,
    description: frontMatter.description,
    image:
      frontMatter.thumbnail ||
      `${PUBLIC_CONTENT_IMG_PATH}/default-og-image.jpeg`,
    author: {
      "@type": "Person",
      name: "김형석",
    },
    publisher: {
      "@type": "Organization",
      name: BASE_META_TITLE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/image/logo.svg`,
      },
    },
    datePublished: frontMatter.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/posts/${params.slug.join("/")}`,
    },
  };

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
        mdxComponents={{ MdxComponentWrapper, SkeletonBar }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default PostPage;
