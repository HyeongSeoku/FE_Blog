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
import { BASE_URL, DEFAULT_POST_THUMBNAIL } from "@/constants/basic.constants";
import { getMdxFilesRecursively } from "./file";

import http from "http";
import https from "https";

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

  const thumbnail = (data.thumbnail ||
    getRepresentativeImage(data, content)) as string;
  const frontMatter: FrontMatterProps = {
    ...(data as FrontMatterProps),
    thumbnail,
  };
  // Find related posts based on tags and category
  const currentTags = frontMatter.tags || [];
  const currentCategory = frontMatter.category;

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

export const getRepresentativeImage = async (
  data: any,
  content: string,
): Promise<string> => {
  let candidate = data.thumbnail;

  // content에서 첫 번째 이미지가 있는 경우 candidate로 설정
  if (!candidate) {
    const firstImageMatch = content.match(/!\[.*\]\((.*)\)/);
    if (firstImageMatch && firstImageMatch[1]) {
      candidate = firstImageMatch[1];
    }
  }

  // 이미지 유효성 검사
  if (await isValidImageUrl(candidate)) {
    return candidate;
  }

  // fallback 이미지 반환
  return DEFAULT_POST_THUMBNAIL;
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

export const isValidImageUrl = async (url?: string): Promise<boolean> => {
  if (!url) return false;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || BASE_URL;

    let absoluteUrl = url;
    if (url.startsWith("/")) {
      absoluteUrl = baseUrl + url;
    }

    const protocol = absoluteUrl.startsWith("https") ? https : http;

    return await new Promise((resolve) => {
      const req = protocol.request(absoluteUrl, { method: "HEAD" }, (res) => {
        const contentType = res.headers["content-type"];
        resolve(res.statusCode === 200 && !!contentType?.startsWith("image/"));
      });
      req.on("error", () => resolve(false));
      req.end();
    });
  } catch {
    return false;
  }
};
