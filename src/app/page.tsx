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
        <MainSection title="시리즈">
          <SeriesSection
            seriesList={seriesList}
            maxLength={SERIES_MAX_LENGTH}
          />
        </MainSection>
      )}
    </DefaultLayout>
  );
}
