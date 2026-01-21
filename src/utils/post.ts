/**해당 파일은 server 전용 파일 */
import { getMdxFilesRecursively } from "@/utils/file";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  Category,
  SubCategory,
  PostDataProps,
  getAllPostsRequest,
  getAllPostResponse,
  getPostsByCategoryResponse,
} from "@/types/posts";
import { getMdxContents, getRepresentativeImage } from "./mdx";
import { getDate } from "./date";

import {
  CATEGORY_MAP,
  DEFAULT_PAGE_SIZE,
  SUB_CATEGORY_MAP,
} from "@/constants/post.constants";
import { GetMdxContentsBase } from "@/types/mdx";

const POST_PATH = path.join(process.cwd(), "src/mdx/content");

export const getAllPosts = async ({
  isSorted = true,
  maxCount,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  targetYear,
}: getAllPostsRequest): Promise<getAllPostResponse> => {
  const filePaths = await getMdxFilesRecursively(POST_PATH);
  const categoryCounts: Record<Category, number> = Object.fromEntries(
    Object.keys(CATEGORY_MAP).map((key) => [key, 0]),
  ) as Record<Category, number>;
  const seriesCounts: Record<string, number> = {};

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

      const category = data.category as Category;

      if (CATEGORY_MAP[category]) {
        categoryCounts[category] += 1;
      }

      const series = data.series;
      const seriesOrder = data.seriesOrder;

      const hasValidSeries =
        typeof series === "string" &&
        series.trim() !== "" &&
        typeof seriesOrder === "number";

      if (hasValidSeries) {
        if (!seriesCounts[series]) {
          seriesCounts[series] = 0;
        }
        seriesCounts[series] += 1;
      }

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
        ...(hasValidSeries && {
          series,
          seriesOrder,
        }),
      };
    }),
  );

  const validPosts = posts.filter(Boolean) as PostDataProps[];

  let resultPosts = validPosts;

  if (targetYear) {
    resultPosts = filterPosts(resultPosts, {
      tags: undefined,
      category: undefined,
    }).filter((post) => Number(getDate("YYYY", post.createdAt)) === targetYear);
  }

  resultPosts = sortAndPaginatePosts(resultPosts, { isSorted, page, pageSize });

  if (maxCount) {
    resultPosts = resultPosts.slice(0, maxCount);
  }

  return {
    postList: resultPosts,
    totalPostCount: validPosts.length,
    categoryCounts,
    seriesCounts,
  };
};

export const getPostsDetail = async (
  slug: string[],
): Promise<GetMdxContentsBase<string> | null> => {
  const mdxContentData = await getMdxContents(slug, POST_PATH, false, {
    serialize: false as const,
  });
  return mdxContentData;
};

/**
 * 태그를 URL-safe한 형태로 정규화
 */
const normalizeTag = (tag: string): string => {
  return tag.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
};

export const getPostsByTag = async (
  tag: string,
): Promise<{
  list: PostDataProps[];
  count: number;
  tagList: { key: string; value: number }[];
}> => {
  const filePaths = await getMdxFilesRecursively(POST_PATH);
  const normalizedSearchTag = normalizeTag(tag);

  const tagCounts: Record<string, number> = {};

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const thumbnail = getRepresentativeImage(data, content);

      if (!data?.title || !data?.tags || !data?.category || !data?.createdAt) {
        console.warn(`🛠️  ${filePath} 파일에서 필수 메타데이터가 없습니다.`);
        return null;
      }

      const tags: string[] = Array.isArray(data.tags)
        ? data.tags
        : data.tags.split(",");

      // 정규화된 태그로 카운트
      tags.forEach((t) => {
        const normalizedTag = normalizeTag(t);
        if (normalizedTag) {
          tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
        }
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
        thumbnail,
      };
    }),
  );

  // 정규화된 태그로 비교
  const filteredPosts = (posts.filter(Boolean) as PostDataProps[]).filter(
    (post) => post.tags.some((t) => normalizeTag(t) === normalizedSearchTag),
  );

  const tagList = Object.keys(tagCounts)
    .map((key) => ({ key, value: tagCounts[key] }))
    .sort((a, b) => a.key.localeCompare(b.key)); // 알파벳 순 정렬

  return { list: filteredPosts, count: filteredPosts.length, tagList };
};

export const getAllTags = async (): Promise<string[]> => {
  const { postList } = await getAllPosts({});
  const tagSet = new Set<string>();

  postList.forEach((post) => {
    post.tags.forEach((tag) => {
      // 공백을 하이픈으로 변환하여 URL-safe하게
      const normalizedTag = tag
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      if (normalizedTag) {
        tagSet.add(normalizedTag);
      }
    });
  });

  return Array.from(tagSet).sort();
};

export const getAllYears = async (): Promise<string[]> => {
  const { postList } = await getAllPosts({});
  const yearSet = new Set<string>();

  postList.forEach((post) => {
    const year = getDate("YYYY", post.createdAt);
    if (year !== "Invalid Date") {
      yearSet.add(year);
    }
  });

  return Array.from(yearSet).sort();
};

export const getYearlyPostCounts = async (): Promise<
  { year: string; count: number }[]
> => {
  const { postList } = await getAllPosts({});
  const yearCounts: Record<string, number> = {};

  postList.forEach((post) => {
    const year = getDate("YYYY", post.createdAt);
    if (year !== "Invalid Date") {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
  });

  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(b.year) - Number(a.year)); // 최신순 정렬
};

export const getAllMonths = async (): Promise<string[]> => {
  const { postList } = await getAllPosts({});
  const monthSet = new Set<string>();

  postList.forEach((post) => {
    const year = getDate("YYYY", post.createdAt);
    const month = getDate("MM", post.createdAt);

    if (year !== "Invalid Date" && month !== "Invalid Date") {
      monthSet.add(`${year}-${month}`);
    }
  });

  return Array.from(monthSet).sort();
};

export const getPostsByDate = async ({
  type,
  date,
  isSorted = true,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  type: "year" | "month";
  date: string;
  isSorted?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<getAllPostResponse> => {
  // 모든 게시물을 가져옵니다.
  const { postList: allPosts, categoryCounts } = await getAllPosts({
    isSorted,
    page: 1,
    pageSize: Number.MAX_SAFE_INTEGER,
  });

  // 날짜 필터링
  const filteredPosts = allPosts.filter((post) => {
    const postYear = getDate("YYYY", post.createdAt);
    const postMonth = getDate("MM", post.createdAt);

    if (postYear === "Invalid Date") return false;

    if (type === "year") {
      return postYear === date;
    }

    if (type === "month") {
      const normalized = date.replace(/\./g, "-");
      const [year, month] = normalized.split("-");
      return postYear === year && postMonth === month.padStart(2, "0");
    }

    return false;
  });

  // 페이징 및 정렬 적용
  const resultPosts = sortAndPaginatePosts(filteredPosts, {
    isSorted,
    page,
    pageSize,
  });

  return {
    postList: resultPosts,
    totalPostCount: filteredPosts.length,
    categoryCounts,
  };
};

export const getPostsByCategory = async ({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  categoryKey,
}: {
  page?: number;
  pageSize?: number;
  categoryKey: string;
}): Promise<getPostsByCategoryResponse> => {
  const { postList, totalPostCount, categoryCounts } = await getAllPosts({
    isSorted: true,
  });

  const filteredPosts = postList.filter(
    ({ category }) => category === categoryKey,
  );

  const start = (page - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(start, start + pageSize);

  return {
    postList: paginatedPosts,
    totalPostCount,
    totalCategoryPostCount: filteredPosts.length,
    categoryCounts: categoryCounts,
  };
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
