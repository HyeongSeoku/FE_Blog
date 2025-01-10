import "swiper/css";
import { getAllPosts } from "@/utils/post";
import { HomeClient } from "./pageClient";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";

export default async function Home() {
  const { postList, totalPostCount } = await getAllPosts({ maxCount: 3 });
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
