import { redirect } from "next/navigation";
import { getAllPosts, getPostsDetail } from "@/utils/mdxServer";
import MdxDetailTemplate from "@/templates/MdxDetailTemplate/MdxDetailTemplate";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug.split("/") }));
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
    title: frontMatter.title || "SEOK 개발 블로그",
    description:
      frontMatter.description ||
      "프론트엔드 개발자 김형석의 개발 블로그입니다.",
    other: { keyword: frontMatter.tags?.join(",") || "" },
  };

  return { postData, metadata };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  const { metadata } = await getPostDataWithMetadata(params.slug);
  return metadata;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { postData } = await getPostDataWithMetadata(params.slug);

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
    </>
  );
}
