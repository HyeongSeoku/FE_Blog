import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import {
  FrontMatterProps,
  getMdxContentsResponse,
  HeadingsProps,
} from "@/types/mdx";
import rehypePrettyCode, { Options } from "rehype-pretty-code";
import fs from "fs/promises";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeCodeBlockClassifier, rehypeHeadingsWithIds } from "./mdxPlugin";
import { PUBLIC_CONTENT_IMG_PATH } from "@/constants/basic.constants";
import { getMdxFilesRecursively } from "./file";

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

  const filePaths = await getMdxFilesRecursively(fileDirectory);
  const posts: {
    slug: string;
    title: string;
    tags: string[];
    category: string;
    createdAt: string;
  }[] = await Promise.all(
    filePaths.map(async (file) => {
      const fileContents = await fs.readFile(file, "utf8");
      const { data } = matter(fileContents);
      return {
        slug: path.relative(fileDirectory, file).replace(/\.mdx$/, ""),
        title: data.title || "",
        tags: data.tags || [],
        category: data.category || "",
        createdAt: data.createdAt || "",
      };
    }),
  );

  // Sort posts by createdAt (descending) or alphabetically as fallback
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Determine current index
  const currentIndex = sortedPosts.findIndex(
    (post) => post.slug === slug.join("/"),
  );

  // Calculate previous and next posts
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

  // Find related posts based on tags and category
  const currentTags = frontMatter.tags || [];
  const currentCategory = frontMatter.category;

  const relatedPosts = sortedPosts
    .filter(
      (post) =>
        post.slug !== slug.join("/") &&
        (post.category === currentCategory ||
          post.tags.some((tag: string) => currentTags.includes(tag))),
    )
    .slice(0, 3)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
    }));

  // MDX plugins
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

  // Additional processing
  const plainTextContent = extractPlainText(content);
  const readingTime = calculateReadingTime(plainTextContent);

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

export const getRepresentativeImage = (data: any, content: string): string => {
  if (data.thumbnail) {
    return data.thumbnail;
  }

  const firstImageMatch = content.match(/!\[.*\]\((.*)\)/);
  if (firstImageMatch && firstImageMatch[1]) {
    return firstImageMatch[1]; // 첫 번째 이미지의 URL 반환
  }

  return `${PUBLIC_CONTENT_IMG_PATH}/default-loading-image.jpeg`;
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
