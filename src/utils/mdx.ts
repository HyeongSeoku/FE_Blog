import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

const PROJECT_PATH = path.join(process.cwd(), "src/mdx/project");
const CONTENT_PATH = path.join(process.cwd(), "src/mdx/content");

export interface ProjectDataProps {
  slug: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  tags: string;
  content: string;
}

export const getAllProjects = () => {
  const fileNames = fs.readdirSync(PROJECT_PATH);

  return fileNames.map((fileName) => {
    const filePath = path.join(PROJECT_PATH, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(/\.mdx$/, ""),
      ...data,
      content,
    };
  });
};

interface getPostsDetailResponse {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

export async function getPostsDetail(
  slug: string[],
): Promise<getPostsDetailResponse | null> {
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
