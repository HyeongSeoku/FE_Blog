import { redirect } from "next/navigation";
import { getAllPosts, getPostsDetail } from "@/utils/mdxServer";
import MdxDetailTemplate from "@/templates/MdxDetailTemplate/MdxDetailTemplate";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug.split("/") }));
}

async function getPostData(slug: string[]) {
  const postData = await getPostsDetail(slug);

  if (!postData) {
    return null;
  }

  return postData;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    return {
      title: "게시글을 찾을 수 없습니다",
      description: "요청하신 게시글이 존재하지 않습니다.",
      other: { keyword: "" },
    };
  }

  const { frontMatter } = postData;

  return {
    title: frontMatter.title || "SEOK 개발 블로그",
    description:
      frontMatter.description ||
      "프론트엔드 개발자 김형석의 개발 블로그입니다.",
    other: { keyword: frontMatter.tags?.join(",") || "" },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    redirect("/not-found");
  }

  const { source, frontMatter, readingTime, heading } = postData;

  return (
    <>
      <MdxDetailTemplate
        source={source}
        readingTime={readingTime}
        frontMatter={frontMatter}
        heading={heading}
      />

      <div style={{ height: "400px" }}>TEST</div>
    </>
  );
}
