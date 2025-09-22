import { BASE_META_TITLE } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { getAllPosts } from "@/utils/post";
import { getPostsBySeries, getSeriesMetadata } from "@/utils/series";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateMetadata({
  params,
}: {
  params: { seriesName: string };
}): Metadata {
  const { seriesName } = params;
  const metaTitle = `${BASE_META_TITLE} | 시리즈 ${seriesName}`;
  const metaDescription = `${BASE_META_TITLE}의 시리즈 : ${seriesName} 페이지입니다`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `/series/${encodeURIComponent(seriesName)}`,
      type: "website",
      images: [],
    },
    alternates: {
      canonical: `/series/${encodeURIComponent(seriesName)}`,
    },
  };
}

export interface SeriesDetailPageProps {
  params: { seriesName: string };
  searchParams?: { page?: string };
}

export default async function SeriesDetailPage({
  params,
  searchParams,
}: SeriesDetailPageProps) {
  const { seriesName } = params;
  const page = Number(searchParams?.page ?? 1);
  const pageSize = DEFAULT_PAGE_SIZE;

  const seriesMeta = getSeriesMetadata(seriesName);
  if (!seriesMeta) {
    return notFound();
  }

  const { postList: allPosts } = await getAllPosts({});
  const seriesPosts = getPostsBySeries(allPosts, seriesName);

  const totalCount = seriesPosts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const paginated = seriesPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <BlogDateTemplate
      dateText={seriesMeta.title}
      postCount={totalCount}
      postList={paginated}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
