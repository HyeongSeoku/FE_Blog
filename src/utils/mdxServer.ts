import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode, { Options } from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
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
  heading?: HeadingsProps[];
  previousPost: RelatedPost | null;
  nextPost: RelatedPost | null;
  relatedPosts: RelatedPost[] | null;
}

export interface RelatedPost {
  slug: string;
  title: string;
}

interface ExtendedElement extends Element {
  properties?: Record<string, any>;
}

interface HeadingItems {
  value?: string;
  type?: string;
}

// export const getMdxContents = async (
//   slug: string[],
//   fileDirectory: string,
// ): Promise<getMdxContentsResponse | null> => {
//   const filePath = path.join(fileDirectory, ...slug) + ".mdx";

//   try {
//     await fs.access(filePath);
//   } catch (error) {
//     console.error("File not found:", error);
//     return null;
//   }

//   const rehypePrettyCodeOptions: Options = {
//     theme: "github-dark",
//     onVisitLine(node) {
//       if (node.children.length === 0) {
//         node.children = [{ type: "text", value: " " }];
//       }
//     },
//     onVisitHighlightedLine(node) {
//       node.properties.className = [
//         ...(node.properties.className || []),
//         "highlighted-line",
//       ];
//     },
//     onVisitHighlightedChars(node) {
//       node.properties.className = ["highlighted-word"];
//     },
//   };

//   const source = await fs.readFile(filePath, "utf8");
//   const heading = extractHeadings(source);
//   const { content, data } = matter(source);
//   const frontTypeData = data as FrontMatterProps;

//   if (!frontTypeData.title) {
//     throw new Error("Front matter does not contain required 'title' field");
//   }

//   const mdxSource = await serialize(content, {
//     mdxOptions: {
//       rehypePlugins: [
//         [rehypeHeadingsWithIds, heading],
//         [rehypePrettyCode, rehypePrettyCodeOptions],
//         [
//           rehypeExternalLinks,
//           { target: "_blank", rel: ["noopener", "noreferrer"] },
//         ],
//         rehypeCodeBlockClassifier,
//       ],
//     },
//     scope: data,
//   });

//   const plainTextContent = extractPlainText(content);
//   const readingTime = calculateReadingTime(plainTextContent);

//   const allPosts = await getAllPosts();
//   const sortedPosts = allPosts.sort((a, b) => {
//     const dateA = new Date(a.createdAt).getTime();
//     const dateB = new Date(b.createdAt).getTime();
//     return dateA - dateB;
//   });

//   const currentIndex = sortedPosts.findIndex(
//     (post) => post.slug === slug.join("/"),
//   );
//   const currentTags = frontTypeData.tags || [];
//   const currentCategory = frontTypeData.category;

//   const filteredByTag = sortedPosts.filter(
//     (post) =>
//       post.slug !== slug.join("/") &&
//       post.tags &&
//       post.tags.some((tag) => currentTags.includes(tag)),
//   );

//   const filteredByCategory = sortedPosts.filter(
//     (post) => post.slug !== slug.join("/") && post.category === currentCategory,
//   );

//   const previousPost =
//     currentIndex > 0
//       ? {
//           slug: sortedPosts[currentIndex - 1].slug,
//           headings: extractHeadings(sortedPosts[currentIndex - 1].content),
//           title: sortedPosts[currentIndex - 1].title,
//         }
//       : null;

//   const nextPost =
//     currentIndex < sortedPosts.length - 1
//       ? {
//           slug: sortedPosts[currentIndex + 1].slug,
//           headings: extractHeadings(sortedPosts[currentIndex + 1].content),
//           title: sortedPosts[currentIndex + 1].title,
//         }
//       : null;

//   return {
//     source: mdxSource,
//     frontMatter: frontTypeData,
//     readingTime,
//     heading,
//     previousPost,
//     nextPost,
//   };
// };

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

  // Read and parse the MDX file
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const frontMatter = data as FrontMatterProps;

  if (!frontMatter.title) {
    throw new Error("Front matter does not contain required 'title' field");
  }

  // MDX plugins and processing
  const rehypePrettyCodeOptions: Options = {
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

  const heading = extractHeadings(content);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [rehypeHeadingsWithIds, heading],
        [rehypePrettyCode, rehypePrettyCodeOptions],
        [
          rehypeExternalLinks,
          { target: "_blank", rel: ["noopener", "noreferrer"] },
        ],
        rehypeCodeBlockClassifier,
      ],
    },
    scope: data,
  });

  const plainTextContent = extractPlainText(content);
  const readingTime = calculateReadingTime(plainTextContent);

  // Fetch and sort all posts
  const allPosts = await getAllPosts();
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Find the current post's index
  const currentIndex = sortedPosts.findIndex(
    (post) => post.slug === slug.join("/"),
  );

  const previousPost =
    currentIndex > 0
      ? {
          slug: sortedPosts[currentIndex - 1].slug,
          title: sortedPosts[currentIndex - 1].title,
        }
      : null;

  const nextPost =
    currentIndex < sortedPosts.length - 1
      ? {
          slug: sortedPosts[currentIndex + 1].slug,
          title: sortedPosts[currentIndex + 1].title,
        }
      : null;

  const relatedPosts = findRelatedPosts(allPosts, slug, frontMatter);

  return {
    source: mdxSource,
    frontMatter,
    readingTime,
    heading,
    previousPost,
    nextPost,
    relatedPosts,
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

export const extractHeadings = (content: string): HeadingsProps[] => {
  const headings: HeadingsProps[] = [];
  const headingCounts = new Map<string, number>();

  const cleanedContent = content.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(cleanedContent)) !== null) {
    const [_, hashes, text] = match;

    const level = hashes.length;

    if (level > 3) continue;

    const baseId = text.trim().replace(/\s+/g, "-").toLowerCase();
    const count = headingCounts.get(baseId) || 0;
    headingCounts.set(baseId, count + 1);

    const uniqueId = count === 0 ? baseId : `${baseId}-${count}`;

    headings.push({ id: uniqueId, text, level, isVisit: false });
  }

  return headings;
};

// Element 타입 확장

export const rehypeHeadingsWithIds = (headingData: HeadingsProps[]) => {
  return (tree: any) => {
    // 노드를 탐색하며 조작
    visit(tree, "element", (node) => {
      // 노드 조작 로직
      const elementNode = node as ExtendedElement;

      if (["h2", "h3"].includes(elementNode.tagName || "")) {
        for (const item of elementNode.children) {
          const headingItem = item as HeadingItems;
          if (headingItem.value && headingItem.type === "text") {
            const headingLevel = elementNode.tagName === "h2" ? 2 : 3;
            const heading = headingData.find(
              (h) =>
                h.text === headingItem.value &&
                !h.isVisit &&
                h.level === headingLevel,
            );

            if (heading) {
              heading.isVisit = true;
            }

            // 헤딩이 존재하면 id 속성 추가
            if (heading) {
              elementNode.properties = elementNode.properties || {};
              elementNode.properties.id = heading.id;
            }
          }
        }
      }
    });

    return tree;
  };
};

export const findRelatedPosts = (
  allPosts: PostDataProps[],
  slug: string[],
  frontMatter: FrontMatterProps,
): RelatedPost[] => {
  const currentTags = frontMatter.tags || [];
  const currentCategory = frontMatter.category;

  const filteredByTag = allPosts.filter(
    (post) =>
      post.slug !== slug.join("/") &&
      post.tags &&
      post.tags.some((tag) => currentTags.includes(tag)),
  );

  const filteredByCategory = allPosts.filter(
    (post) => post.slug !== slug.join("/") && post.category === currentCategory,
  );

  return filteredByTag.length > 0
    ? filteredByTag.map((post) => ({ slug: post.slug, title: post.title }))
    : filteredByCategory.map((post) => ({
        slug: post.slug,
        title: post.title,
      }));
};

export const rehypeCodeBlockClassifier = () => {
  return (tree: any) => {
    visit(tree, "element", (node, index, parent) => {
      const elementNode = node as ExtendedElement;

      if (elementNode.tagName === "code") {
        const isBlockCode = parent?.tagName === "pre";

        node.properties = {
          ...(node.properties || {}),
          className: [
            ...(node.properties.className || []),
            isBlockCode ? "block-code" : "inline-code",
          ],
        };
      }
    });
  };
};
