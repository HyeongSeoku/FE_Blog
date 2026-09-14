import type { Metadata } from "next";
import Link from "next/link";
import BlogPostListItem from "@/components/BlogPostListItem";
import SeriesListItem from "@/components/SeriesListItem";
import { BASE_URL } from "@/constants/basic.constants";
import {
  DEFAULT_MAIN_POST_COUNT,
  SERIES_MAX_LENGTH,
} from "@/constants/post.constants";
import DefaultLayout from "@/layout/DefaultLayout";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import { getAllPosts } from "@/utils/post";
import { getAllSeriesMetadata } from "@/utils/series";
import { getStructuredData } from "@/utils/structure";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function Home() {
  const { postList, totalPostCount } = await getAllPosts({
    maxCount: DEFAULT_MAIN_POST_COUNT,
    isSorted: true,
  });
  const seriesData = await getAllSeriesMetadata({ sortByLatestPost: true });
  const seriesList = Object.entries(seriesData).slice(0, SERIES_MAX_LENGTH);

  const structuredData = getStructuredData();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "김형석 블로그",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/categories?tags={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <DefaultLayout structuredData={structuredData}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <IntroSectionTemplate />

      <section className="mt-section flex flex-col gap-4">
        <h2 className="text-label text-muted">글</h2>
        <div className="flex flex-col gap-item">
          {postList.map((post, index) => (
            <BlogPostListItem
              key={post.slug}
              title={post.title}
              createdAt={post.createdAt}
              slug={post.slug}
              index={index}
            />
          ))}
        </div>
        {totalPostCount > DEFAULT_MAIN_POST_COUNT && (
          <Link
            href="/archive"
            className="mt-2 text-meta text-muted transition-opacity hover:opacity-[.55]"
          >
            전체 목록
          </Link>
        )}
      </section>

      {!!seriesList.length && (
        <section className="mt-section flex flex-col gap-4">
          <h2 className="text-label text-muted">시리즈</h2>
          <div className="flex flex-col gap-item">
            {seriesList.map(([key, value], index) => (
              <SeriesListItem
                key={key}
                seriesKey={key}
                title={value.title}
                count={value.count}
                latestDate={value.latestDate}
                index={index}
              />
            ))}
          </div>
          <Link
            href="/series"
            className="mt-2 text-meta text-muted transition-opacity hover:opacity-[.55]"
          >
            전체 시리즈
          </Link>
        </section>
      )}
    </DefaultLayout>
  );
}
