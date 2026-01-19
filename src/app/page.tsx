import { getAllPosts } from "@/utils/post";
import { HomeClient } from "./pageClient";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";
import {
  DEFAULT_MAIN_POST_COUNT,
  SERIES_MAX_LENGTH,
} from "@/constants/post.constants";
import MainSection from "@/components/MainSection";
import Link from "next/link";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import { getStructuredData } from "@/utils/structure";

import { getAllSeriesMetadata } from "@/utils/series";
import { SeriesSection } from "@/components/SeriesSection";
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

  const githubData = await fetchGithubUserInfo();

  const structuredData = getStructuredData();

  return (
    <DefaultLayout structuredData={structuredData}>
      <IntroSectionTemplate githubData={githubData} />

      <HomeClient
        postList={postList}
        postCount={totalPostCount}
        githubData={githubData}
      />

      <MainSection
        title="게시물"
        titleChildren={
          totalPostCount > DEFAULT_MAIN_POST_COUNT ? (
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-theme transition-colors"
            >
              더보기
            </Link>
          ) : null
        }
      >
        <PostSectionTemplate postList={postList} />
      </MainSection>

      {!!seriesList.length && (
        <section className="my-16">
          {/* 시리즈 섹션 헤더 */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 block">
                In-Depth Series
              </span>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                Structured Learning Paths
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
    </DefaultLayout>
  );
}
