import { getMdxFilesRecursively } from "@/utils/file";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  Category,
  categoryMap,
  SubCategory,
  SubCategoryMap,
  PostDataProps,
  getAllPostsRequest,
  getAllProjectsResponse,
} from "@/types/posts";
import { getMdxContents } from "./mdx";
import { getMdxContentsResponse } from "@/types/mdx";

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
): Promise<{ list: PostDataProps[]; count: number }> => {
  const filePaths = await getMdxFilesRecursively(POST_PATH);

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);

      if (!data?.title || !data?.tags || !data?.category || !data?.createdAt) {
        console.warn(`🛠️  ${filePath} 파일에서 필수 메타데이터가 없습니다.`);
        return null;
      }

      const tags = Array.isArray(data.tags) ? data.tags : data.tags.split(",");
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

  return { list: filteredPosts, count: filteredPosts.length };
};

export const isValidCategory = (category: Category): boolean => {
  return !!categoryMap[category];
};

export const isValidSubCategory = (
  category: Category,
  subCategory?: SubCategory,
): boolean => {
  if (!subCategory) return false;
  return SubCategoryMap[category].includes(subCategory);
};

// 년도별 그룹화 함수
const groupPostsByYear = (
  postList: PostDataProps[],
): Record<number, PostDataProps[]> => {
  return postList.reduce<Record<number, PostDataProps[]>>((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
};

// 년도-월별 그룹화 함수
const groupPostsByMonth = (
  postList: PostDataProps[],
): Record<string, PostDataProps[]> => {
  return postList.reduce<Record<string, PostDataProps[]>>((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    if (!acc[month]) acc[month] = [];
    acc[month].push(post);

    return acc;
  }, {});
};

// 옵션에 따라 그룹화 방식 선택
export const groupPosts = (
  postList: PostDataProps[],
  groupBy: "year" | "month",
): Record<number, any> => {
  if (groupBy === "year") {
    return groupPostsByYear(postList);
  } else if (groupBy === "month") {
    return groupPostsByMonth(postList);
  }
  throw new Error("Invalid grouping option. Use 'year' or 'month'.");
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
