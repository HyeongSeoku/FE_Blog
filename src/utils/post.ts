import { getMdxFilesRecursively } from "@/utils/file";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  Category,
  SubCategory,
  PostDataProps,
  getAllPostsRequest,
  getAllProjectsResponse,
} from "@/types/posts";
import { getMdxContents, getRepresentativeImage } from "./mdx";
import { getMdxContentsResponse } from "@/types/mdx";
import { CATEGORY_MAP, SUB_CATEGORY_MAP } from "@/constants/post.constants";

const POST_PATH = path.join(process.cwd(), "src/mdx/content");

export const getAllPosts = async ({
  isSorted = true,
  maxCount,
  page,
  pageSize = 10,
  targetYear,
}: getAllPostsRequest): Promise<getAllProjectsResponse> => {
  const filePaths = await getMdxFilesRecursively(POST_PATH);

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const thumbnail = getRepresentativeImage(data, content);

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

      return {
        slug: path.relative(POST_PATH, filePath).replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        tags: Array.isArray(data.tags) ? data.tags : data.tags.split(","),
        content: content || "",
        category: data.category,
        subCategory,
        thumbnail,
      };
    }),
  );

  const validPosts = posts.filter(Boolean) as PostDataProps[];

  let resultPosts = validPosts;

  if (targetYear) {
    resultPosts = filterPosts(resultPosts, {
      tags: undefined,
      category: undefined,
    }).filter((post) => new Date(post.createdAt).getFullYear() === targetYear);
  }

  resultPosts = sortAndPaginatePosts(resultPosts, { isSorted, page, pageSize });

  if (maxCount) {
    resultPosts = resultPosts.slice(0, maxCount);
  }

  return { postList: resultPosts, totalPostCount: validPosts.length };
};

export const getPostsDetail = async (
  slug: string[],
): Promise<getMdxContentsResponse | null> => {
  const mdxContentData = await getMdxContents(slug, POST_PATH);
  return mdxContentData;
};

export const getPostsByTag = async (
  tag: string,
): Promise<{
  list: PostDataProps[];
  count: number;
  tagList: { key: string; value: number }[];
}> => {
  const filePaths = await getMdxFilesRecursively(POST_PATH);

  const tagCounts: Record<string, number> = {};

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);

      if (!data?.title || !data?.tags || !data?.category || !data?.createdAt) {
        console.warn(`🛠️  ${filePath} 파일에서 필수 메타데이터가 없습니다.`);
        return null;
      }

      const tags: string[] = Array.isArray(data.tags)
        ? data.tags
        : data.tags.split(",");
      tags.forEach((tag) => {
        const lowerCaseTag = tag.trim().toLowerCase();
        tagCounts[lowerCaseTag] = (tagCounts[lowerCaseTag] || 0) + 1;
      });

      return {
        slug: path.relative(POST_PATH, filePath).replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description || "",
        createdAt: data.createdAt,
        tags,
        content,
        category: data.category,
        subCategory: data.subCategory || "",
      };
    }),
  );

  const filteredPosts = (posts.filter(Boolean) as PostDataProps[]).filter(
    (post) => post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );

  const tagList = Object.keys(tagCounts).map((key) => {
    return { key, value: tagCounts[key] * 2 };
  });

  return { list: filteredPosts, count: filteredPosts.length, tagList };
};

export const getPostsByDate = async ({
  type,
  date,
  isSorted = true,
  page,
  pageSize = 10,
}: {
  type: "year" | "month";
  date: string;
  isSorted?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<getAllProjectsResponse> => {
  // 모든 게시물을 가져옵니다.
  const { postList: allPosts, totalPostCount } = await getAllPosts({
    isSorted,
    page: 1,
    pageSize: Number.MAX_SAFE_INTEGER, // 모든 게시물을 가져오기 위해 설정
  });

  // 날짜 필터링
  const filteredPosts = allPosts.filter((post) => {
    const createdAt = new Date(post.createdAt);

    if (type === "year") {
      // type이 "year"일 경우 연도만 비교
      return createdAt.getFullYear().toString() === date;
    }

    if (type === "month") {
      // type이 "month"일 경우 "YYYY.MM" 형식 비교
      const [year, month] = date.split(".").map((str) => parseInt(str, 10));
      return (
        createdAt.getFullYear() === year && createdAt.getMonth() + 1 === month
      );
    }

    return false;
  });

  // 페이징 및 정렬 적용
  const resultPosts = sortAndPaginatePosts(filteredPosts, {
    isSorted,
    page,
    pageSize,
  });

  return { postList: resultPosts, totalPostCount };
};

export const isValidCategory = (category: Category): boolean => {
  return !!CATEGORY_MAP[category];
};

export const isValidSubCategory = (
  category: Category,
  subCategory?: SubCategory,
): boolean => {
  if (!subCategory) return false;
  return SUB_CATEGORY_MAP[category].includes(subCategory);
};

export const filterPosts = (
  posts: PostDataProps[],
  filters: { tags?: string[]; category?: string },
): PostDataProps[] => {
  return posts.filter((post) => {
    if (filters.tags && !filters.tags.some((tag) => post.tags.includes(tag))) {
      return false;
    }
    if (filters.category && post.category !== filters.category) {
      return false;
    }
    return true;
  });
};

export const sortAndPaginatePosts = (
  posts: PostDataProps[],
  options: { isSorted?: boolean; page?: number; pageSize?: number },
): PostDataProps[] => {
  let result = posts;

  if (options.isSorted) {
    result = result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  if (options.page && options.pageSize) {
    const start = (options.page - 1) * options.pageSize;
    result = result.slice(start, start + options.pageSize);
  }

  return result;
};
