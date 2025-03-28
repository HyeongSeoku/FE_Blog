import { getAllPosts } from "@/utils/post";
import { HomeClient } from "./pageClient";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";
import { DEFAULT_MAIN_POST_COUNT } from "@/constants/post.constants";

export const dynamic = "force-static";

export default async function Home() {
  const { postList, totalPostCount } = await getAllPosts({
    maxCount: DEFAULT_MAIN_POST_COUNT,
  });
  const githubData = await fetchGithubUserInfo();

  return (
    <DefaultLayout>
      <HomeClient
        postList={postList}
        postCount={totalPostCount}
        githubData={githubData}
      />
    </DefaultLayout>
  );
}
