import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import {
  FrontMatterProps,
  GetMdxContentsBase,
  HeadingsProps,
  SerializeOptions,
} from "@/types/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode, { Options } from "rehype-pretty-code";
import fs from "fs/promises";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeCodeBlockClassifier, rehypeHeadingsWithIds } from "./mdxPlugin";
import { BASE_URL, DEFAULT_POST_THUMBNAIL } from "@/constants/basic.constants";
import { getMdxFilesRecursively } from "./file";

import http from "http";
import https from "https";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export async function getMdxContents<T extends boolean>(
  slug: string[],
  fileDirectory: string,
  hasDefaultImg: boolean = true,
  opts?: {
    serialize?: T;
    mdxOptions?: any;
    scope?: Record<string, any>;
  },
): Promise<GetMdxContentsBase<
  T extends true ? MDXRemoteSerializeResult : string
> | null> {
  const filePath = path.join(fileDirectory, ...slug) + ".mdx";

  try {
    await fs.access(filePath);
  } catch (error) {
    console.error("File not found:", error);
    return null;
  }

  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  const thumbnail =
    (data.thumbnail as string) ||
    getRepresentativeImage(data, content, hasDefaultImg);

  const frontMatter: FrontMatterProps = {
    ...(data as FrontMatterProps),
    thumbnail,
  };

  if (!frontMatter.title) {
    throw new Error("Front matter does not contain required 'title' field");
  }

  // 관련 포스트 계산 (기존 로직 그대로)
  const filePaths = await getMdxFilesRecursively(fileDirectory);
  const posts = await Promise.all(
    filePaths.map(async (file) => {
      const fileContents = await fs.readFile(file, "utf8");
      const { data } = matter(fileContents);
      return {
        slug: path.relative(fileDirectory, file).replace(/\.mdx$/, ""),
        title: (data.title as string) || "",
        tags: (data.tags as string[]) || [],
        category: (data.category as string) || "",
        createdAt: (data.createdAt as string) || "",
      };
    }),
  );

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

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

  const currentTags = frontMatter.tags || [];
  const currentCategory = frontMatter.category;

  const relatedPosts = sortedPosts
    .filter(
      (post) =>
        post.slug !== slug.join("/") &&
        (post.category === currentCategory ||
          post.tags.some((tag) => currentTags.includes(tag))),
    )
    .slice(0, 3)
    .map((post) => ({ slug: post.slug, title: post.title }));

  const rehypePrettyCodeOptions: Options = {
    theme: "github-dark",
    onVisitLine(node) {
      if (node.children.length === 0)
        node.children = [{ type: "text", value: " " }];
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

  const defaultMdxOptions: SerializeOptions["mdxOptions"] = {
    rehypePlugins: [
      [rehypeHeadingsWithIds, heading],
      [rehypePrettyCode, rehypePrettyCodeOptions],
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
      rehypeCodeBlockClassifier,
    ],
  };

  const mdxOptionsMerged: SerializeOptions["mdxOptions"] = {
    ...defaultMdxOptions,
    ...(opts?.mdxOptions || {}),
  };

  let source: T extends true ? MDXRemoteSerializeResult : string;

  if (opts?.serialize) {
    source = (await serialize(content, {
      mdxOptions: mdxOptionsMerged,
      scope: { ...(data as object), ...(opts.scope || {}) },
    })) as T extends true ? MDXRemoteSerializeResult : string;
  } else {
    const processed = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true }) // md -> hast
      .use(rehypeRaw) // raw HTML 통합
      .use(rehypeHeadingsWithIds, heading)
      .use(rehypePrettyCode, rehypePrettyCodeOptions) // 코드 하이라이트(+line span)
      .use(rehypeExternalLinks, {
        target: "_blank",
        rel: ["noopener", "noreferrer"],
      })
      .use(rehypeCodeBlockClassifier)
      .use(rehypeStringify, { allowDangerousHtml: true }) // HTML 출력
      .process(content);

    source = String(processed) as T extends true
      ? MDXRemoteSerializeResult
      : string;
  }

  const plainTextContent = extractPlainText(content);
  const readingTime = calculateReadingTime(plainTextContent);

  return {
    source,
    frontMatter,
    readingTime,
    heading,
    previousPost,
    nextPost,
    relatedPosts,
    rehypePlugins: mdxOptionsMerged?.rehypePlugins || [],
  };
}

/**
 * 대표 이미지 추출 유틸
 * @param frontMatter - mdx 메타 정보
 * @param content - mdx 본문
 * @param returnDefaultImg - true면 fallback 이미지 반환 (default: true)
 */
export function getRepresentativeImage(
  frontMatter: any,
  content: string,
  returnDefaultImg: boolean = true,
): string {
  // frontMatter.thumbnail 우선 사용
  let candidate = frontMatter?.thumbnail;

  // fallback으로 content 내 첫 번째 마크다운 이미지
  if (!candidate) {
    const match = content.match(/!\[.*?\]\((.*?)\)/);
    candidate = match?.[1] ?? "";
  }

  // 이미지 유효성 검사: SSR 안전하게 fetch 없이 판단
  const isValid =
    typeof candidate === "string" &&
    (candidate.startsWith("/") || candidate.startsWith("http"));

  // 유효하면 반환
  if (isValid) return candidate;

  // 유효하지 않고 fallback 허용 시 기본 이미지 반환
  return returnDefaultImg ? DEFAULT_POST_THUMBNAIL : "";
}

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
