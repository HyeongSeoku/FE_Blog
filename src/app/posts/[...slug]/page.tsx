import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound, redirect } from "next/navigation";
import PostPageClient from "./pageClient";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

const CONTENT_PATH = path.join(process.cwd(), "src/content");

interface PostPageProps {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

async function fetchPostData(slug: string[]): Promise<PostPageProps | null> {
  const filePath = path.join(CONTENT_PATH, ...slug) + ".mdx";

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  function isFrontMatter(data: any): data is { title: string } {
    return data && typeof data.title === "string";
  }

  if (!isFrontMatter(data)) {
    throw new Error("Front matter does not contain required 'title' field");
  }

  const { serialize } = await import("next-mdx-remote/serialize");

  const mdxSource = await serialize(content, { scope: data });

  return {
    source: mdxSource,
    frontMatter: data,
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const postData = await fetchPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <PostPageClient
      source={postData.source}
      frontMatter={postData.frontMatter}
    />
  );
}
