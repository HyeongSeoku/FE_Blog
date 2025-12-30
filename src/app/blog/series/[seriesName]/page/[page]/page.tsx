import { BASE_META_TITLE } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { getAllPosts } from "@/utils/post";
import {
  getAllSeriesKeys,
  getPostsBySeries,
  getSeriesMetadata,
} from "@/utils/series";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const seriesKeys = getAllSeriesKeys();
  const { postList } = await getAllPosts({});

  return seriesKeys.flatMap((seriesName) => {
    const seriesPosts = getPostsBySeries(postList, seriesName);
    const totalPages = Math.ceil(seriesPosts.length / DEFAULT_PAGE_SIZE);

    if (totalPages <= 1) return [];

    return Array.from({ length: totalPages - 1 }, (_, index) => ({
      seriesName,
      page: String(index + 2),
    }));
  });
}

export function generateMetadata({
  params,
}: {
  params: { seriesName: string; page: string };
}) {
  const { seriesName, page } = params;
  const metaTitle = `${BASE_META_TITLE} | 시리즈 ${seriesName}`;
  const metaDescription = `${BASE_META_TITLE}의 시리즈 : ${seriesName} 페이지입니다`;
  const url = `/blog/series/${encodeURIComponent(seriesName)}/page/${page}`;
  const pageNumber = Number(page);
  const pageSuffix = Number.isFinite(pageNumber) ? ` (page ${page})` : "";

  return {
    title: `${metaTitle}${pageSuffix}`,
    description: metaDescription,
    openGraph: {
      title: `${metaTitle}${pageSuffix}`,
      description: metaDescription,
      url,
      type: "website",
      images: [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: { seriesName: string; page: string };
}) {
  const { seriesName, page } = params;
  const pageSize = DEFAULT_PAGE_SIZE;
  const currentPage = Number(page);

  if (!Number.isFinite(currentPage) || currentPage <= 1) {
    notFound();
  }

  const seriesMeta = getSeriesMetadata(seriesName);
  if (!seriesMeta) {
    return notFound();
  }

  const { postList: allPosts } = await getAllPosts({});
  const seriesPosts = getPostsBySeries(allPosts, seriesName);

  const totalCount = seriesPosts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const boundedPage = Math.max(1, Math.min(currentPage, totalPages));
  const paginated = seriesPosts.slice(
    (boundedPage - 1) * pageSize,
    boundedPage * pageSize,
  );

  if (totalPages && totalPages < currentPage) {
    notFound();
  }

  return (
    <BlogDateTemplate
      dateText={seriesMeta.title}
      postCount={totalCount}
      postList={paginated}
      currentPage={boundedPage}
      totalPages={totalPages}
      basePath={`/blog/series/${encodeURIComponent(seriesName)}`}
    />
  );
}
