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

const parsePageParam = (page?: string[]) => {
  if (!page || page.length === 0) return 1;
  if (page.length !== 2 || page[0] !== "p") return null;
  const current = Number(page[1]);
  if (!Number.isFinite(current) || current < 2) return null;
  return current;
};

export async function generateStaticParams() {
  const seriesKeys = getAllSeriesKeys();
  const { postList } = await getAllPosts({});

  return seriesKeys.flatMap((seriesName) => {
    const seriesPosts = getPostsBySeries(postList, seriesName);
    const totalPages = Math.ceil(seriesPosts.length / DEFAULT_PAGE_SIZE);
    const params: { seriesName: string; page?: string[] }[] = [
      { seriesName, page: [] },
    ];

    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ seriesName, page: ["p", String(page)] });
    }

    return params;
  });
}

export function generateMetadata({
  params,
}: {
  params: { seriesName: string; page?: string[] };
}) {
  const { seriesName } = params;
  const metaTitle = `${BASE_META_TITLE} | 시리즈 ${seriesName}`;
  const metaDescription = `${BASE_META_TITLE}의 시리즈 : ${seriesName} 페이지입니다`;
  const currentPage = parsePageParam(params.page);
  const pageSuffix =
    currentPage && currentPage > 1 ? ` (page ${currentPage})` : "";
  const url =
    currentPage && currentPage > 1
      ? `/blog/series/${encodeURIComponent(seriesName)}/p/${currentPage}`
      : `/blog/series/${encodeURIComponent(seriesName)}`;

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
  params: { seriesName: string; page?: string[] };
}) {
  const { seriesName } = params;
  const pageSize = DEFAULT_PAGE_SIZE;
  const currentPage = parsePageParam(params.page);

  if (!currentPage) {
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
