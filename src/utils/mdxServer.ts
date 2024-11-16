import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode, { Options } from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import { remark } from "remark";
import { visit } from "unist-util-visit";

import { isValidCategory, isValidSubCategory } from "./posts";
import { FrontMatterProps, HeadingsProps } from "@/types/mdx";
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
  frontMatter: FrontMatterProps;
  readingTime?: number;
}
export const getMdxContents = async (
  slug: string[],
  fileDirectory: string,
): Promise<getMdxContentsResponse | null> => {
  const filePath = path.join(fileDirectory, ...slug) + ".mdx";

  try {
    await fs.access(filePath);
  } catch (error) {
    console.error("File not found:", error);
    return null;
  }

  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const frontTypeData = data as FrontMatterProps;

  if (!frontTypeData.title) {
    throw new Error("Front matter does not contain required 'title' field");
  }

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [rehypePrettyCode, rehypePrettyCodeOptions],
        [
          rehypeExternalLinks,
          { target: "_blank", rel: ["noopener", "noreferrer"] },
        ],
      ],
    },
    scope: data,
  });

  const plainTextContent = extractPlainText(content);
  const readingTime = calculateReadingTime(plainTextContent);

  return {
    source: mdxSource,
    frontMatter: frontTypeData,
    readingTime,
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
          `🛠️  게시물 파일 ${filePath} 에 필수 메타데이터가 없습니다. 건너뜁니다.`,
        );
        return null;
      }

      if (!isValidCategory(data?.category)) {
        console.warn(
          `🛠️  게시물 파일 ${filePath} 의 category를 수정하세요. 건너뜁니다.`,
        );
        return null;
      }

      if (!isValidSubCategory(data.category, data?.subCategory)) {
        console.warn(
          `🛠️  게시물 파일 ${filePath} 의 subCategory를 수정하세요.`,
        );
      }

      const subCategory = isValidSubCategory(data.category, data?.subCategory)
        ? data.subCategory
        : "";

      const post: PostDataProps = {
        slug: path.relative(POST_PATH, filePath).replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        tags: Array.isArray(data.tags) ? data.tags : data.tags.split(","),
        content: content || "",
        category: data.category,
        subCategory,
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

export const rehypePrettyCodeOptions: Options = {
  theme: "github-dark",
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = [
      ...(node.properties.className || []),
      "highlighted-line",
    ];
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["highlighted-word"];
  },
};

export const extractPlainText = (content: string): string => {
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const withoutTags = withoutCode.replace(/<[^>]+>/g, "");
  const withoutSpecialChars = withoutTags.replace(/[*#>\[\]`_\-~]/g, "");
  return withoutSpecialChars;
};

export const calculateReadingTime = (text: string) => {
  const WORDS_PER_MINUTES = 200;

  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTES);
  return minutes;
};

export const generateUniqueId = (text: string, existingIds: Set<string>) => {
  const baseId = text.trim().replace(/\s+/g, "-").toLowerCase();
  let uniqueId = baseId;
  let counter = 1;

  // 중복 id 확인 후 고유 id 생성
  while (existingIds.has(uniqueId)) {
    uniqueId = `${baseId}-${counter}`;
    counter++;
  }
  existingIds.add(uniqueId);
  return uniqueId;
};

export const extractHeadings = (content: string): HeadingsProps[] => {
  const existingIds = new Set<string>();
  const ast = remark().parse(content);
  const headings: HeadingsProps[] = [];

  visit(ast, "heading", (node: any) => {
    const text = node.children.map((child: any) => child.value).join("");
    const level = node.depth;
    const id = generateUniqueId(text, existingIds);
    headings.push({ id, text, level });
  });

  return headings;
};
