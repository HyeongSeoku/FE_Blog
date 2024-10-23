import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { PostProps } from "@/types/posts";

export const DEFAULT_MDX_PATH = "src/mdx";
const PROJECT_PATH = path.join(process.cwd(), `${DEFAULT_MDX_PATH}/project`);
const POST_PATH = path.join(process.cwd(), `${DEFAULT_MDX_PATH}/content`);

export interface ProjectDataProps {
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tags: string[];
  content: string;
}

export interface PostDataProps extends PostProps {
  slug: string;
  content: string;
}

interface getMdxContentsResponse {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
  };
}

export const getMdxContents = async (
  slug: string[],
  fileDirectory: string,
): Promise<getMdxContentsResponse | null> => {
  const filePath = path.join(fileDirectory, ...slug) + ".mdx";

  try {
    await fs.access(filePath);
  } catch (error) {
    console.error(error);
    return null;
  }

  const source = await fs.readFile(filePath, "utf8");
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
};

export const getAllProjects = async (): Promise<ProjectDataProps[]> => {
  const fileNames = await fs.readdir(PROJECT_PATH);

  const projects = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(PROJECT_PATH, fileName);
      const fileContents = await fs.readFile(filePath, "utf8");

      const { data, content } = matter(fileContents);

      if (
        !data?.title ||
        !data?.description ||
        !data?.startDate ||
        !data?.endDate ||
        !data?.tags
      ) {
        console.warn(
          `프로젝트 파일 ${fileName}에 필수 메타데이터가 없습니다. 건너뜁니다.`,
        );
        return null;
      }

      return {
        slug: fileName.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        tags: Array.isArray(data.tags) ? data.tags : data.tags.split(","),
        content,
      };
    }),
  );

  return projects.filter(Boolean) as ProjectDataProps[];
};

export const getProjectDetail = async (
  slug: string[],
): Promise<getMdxContentsResponse | null> => {
  const mdxContentData = await getMdxContents(slug, PROJECT_PATH);
  return mdxContentData;
};

const getMdxFilesRecursively = async (dir: string): Promise<string[]> => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        // 디렉토리일 경우 재귀적으로 탐색
        return getMdxFilesRecursively(res);
      } else if (res.endsWith(".mdx")) {
        return res;
      } else {
        return null;
      }
    }),
  );
  return files.flat().filter(Boolean) as string[];
};

export const getAllPosts = async (): Promise<PostDataProps[]> => {
  // 모든 디렉토리에서 .mdx 파일 찾기
  const filePaths = await getMdxFilesRecursively(POST_PATH);

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);

      if (
        !data?.title ||
        !data?.description ||
        !data?.category ||
        !data?.tags ||
        !data?.createdAt
      ) {
        console.warn(
          `게시물 파일 ${filePath}에 필수 메타데이터가 없습니다. 건너뜁니다.`,
        );
        return null;
      }

      const post: PostDataProps = {
        slug: path.relative(POST_PATH, filePath).replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        tags: Array.isArray(data.tags) ? data.tags : data.tags.split(","),
        content: content || "",
        category: data.category,
      };

      return post;
    }),
  );

  return posts.filter(Boolean) as PostDataProps[];
};

export const getPostsDetail = async (
  slug: string[],
): Promise<getMdxContentsResponse | null> => {
  const mdxContentData = await getMdxContents(slug, POST_PATH);
  return mdxContentData;
};
