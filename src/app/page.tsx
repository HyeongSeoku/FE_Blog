import { getAllPosts } from "@/utils/post";
import { HomeClient } from "./pageClient";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";
import { DEFAULT_MAIN_POST_COUNT } from "@/constants/post.constants";
import MainSection from "@/components/MainSection";
import Link from "next/link";
import PostSectionTemplate from "@/templates/PostSectionTemplate/PostSectionTemplate";
import IntroSectionTemplate from "@/templates/IntroSectionTemplate/IntroSectionTemplate";
import { BASE_META_TITLE } from "@/constants/basic.constants";

export default async function Home() {
  const { postList, totalPostCount } = await getAllPosts({
    maxCount: DEFAULT_MAIN_POST_COUNT,
  });
  const githubData = await fetchGithubUserInfo();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BASE_META_TITLE,
    url: "https://seok.dev",
    logo: {
      "@type": "ImageObject",
      url: "https://seok.dev/image/logo.svg",
    },
    sameAs: ["https://github.com/seok"],
  };

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
    </DefaultLayout>
  );
}
