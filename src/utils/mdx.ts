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
import { PUBLIC_IMG_PATH } from "@/constants/basic.constants";

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
    previousPost: null,
    nextPost: null,
    relatedPosts: [],
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

  return `${PUBLIC_IMG_PATH}/default-thumbnail.jpg`;
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
