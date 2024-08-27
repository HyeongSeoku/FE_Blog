import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export const DEFAULT_MDX_PATH = "src/mdx";
const PROJECT_PATH = path.join(process.cwd(), `${DEFAULT_MDX_PATH}/project`);
const CONTENT_PATH = path.join(process.cwd(), `${DEFAULT_MDX_PATH}/content`);

export interface ProjectDataProps {
  slug: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  tags: string[];
  content: string;
}

export const getAllProjects = (): ProjectDataProps[] => {
  const fileNames = fs.readdirSync(PROJECT_PATH);

  return fileNames.reduce((projects: ProjectDataProps[], fileName) => {
    const filePath = path.join(PROJECT_PATH, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    if (
      !data.title ||
      !data.description ||
      !data.startDate ||
      !data.endDate ||
      !data.tags
    ) {
      console.warn(
        `파일 ${fileName}에 필수 메타데이터가 없습니다. 건너뜁니다.`,
      );
      return projects;
    }

    const project = {
      slug: fileName.replace(/\.mdx$/, ""),
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      tags: data.tags.split(","),
      content,
    };

    return [...projects, project];
  }, []);
};

interface getMdxContentsResponse {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

export async function getMdxContents(
  slug: string[],
  fileDirectory: string,
): Promise<getMdxContentsResponse | null> {
  const filePath = path.join(fileDirectory, ...slug) + ".mdx";

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

export async function getPostsDetail(
  slug: string[],
): Promise<getMdxContentsResponse | null> {
  const mdxContentData = await getMdxContents(slug, CONTENT_PATH);
  return mdxContentData;
}

export async function getProjectDetail(
  slug: string[],
): Promise<getMdxContentsResponse | null> {
  const mdxContentData = await getMdxContents(slug, PROJECT_PATH);
  return mdxContentData;
}
