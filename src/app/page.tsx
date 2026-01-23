import { getAllPosts, getYearlyPostCounts } from "@/utils/post";
import { HomeClient } from "./pageClient";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";
import {
  DEFAULT_MAIN_POST_COUNT,
  SERIES_MAX_LENGTH,
} from "@/constants/post.constants";
import { BASE_URL } from "@/constants/basic.constants";
import Link from "next/link";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import { getStructuredData } from "@/utils/structure";

import { getAllSeriesMetadata } from "@/utils/series";
import { SeriesSection } from "@/components/SeriesSection";
import ArchiveSection from "@/components/ArchiveSection";
import { Metadata } from "next";

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
  const seriesList = Object.entries(seriesData);
  const yearlyData = await getYearlyPostCounts();

  const githubData = await fetchGithubUserInfo();

  const structuredData = getStructuredData();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "김형석 블로그",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/blog/tags?tags={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <DefaultLayout structuredData={structuredData}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <IntroSectionTemplate githubData={githubData} />

      <HomeClient
        postList={postList}
        postCount={totalPostCount}
        githubData={githubData}
      />

      <section className="my-16">
        {/* 게시물 섹션 헤더 */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 block">
              Latest
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              최신 게시물
            </h2>
          </div>
          {totalPostCount > DEFAULT_MAIN_POST_COUNT && (
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              View All <span>→</span>
            </Link>
          )}
        </div>
        <PostSectionTemplate postList={postList} />
      </section>

      {!!seriesList.length && (
        <section className="my-16">
          {/* 시리즈 섹션 헤더 */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 block">
                Deep Dive
              </span>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                연재 시리즈
              </h2>
            </div>
            <Link
              href="/blog/series"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              All Series <span>→</span>
            </Link>
          </div>
          <SeriesSection
            seriesList={seriesList}
            maxLength={SERIES_MAX_LENGTH}
          />
        </section>
      )}

      <ArchiveSection yearlyData={yearlyData} />
    </DefaultLayout>
  );
}
