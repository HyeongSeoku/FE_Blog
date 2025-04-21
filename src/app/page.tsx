import { getAllPosts } from "@/utils/post";
import { HomeClient } from "./pageClient";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";
import { DEFAULT_MAIN_POST_COUNT } from "@/constants/post.constants";
import MainSection from "@/components/MainSection";
import Link from "next/link";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";

export default async function Home() {
  const { postList, totalPostCount } = await getAllPosts({
    maxCount: DEFAULT_MAIN_POST_COUNT,
  });
  const githubData = await fetchGithubUserInfo();

  return (
    <DefaultLayout>
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
    </DefaultLayout>
  );
}
