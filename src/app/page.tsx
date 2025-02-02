import { getAllPosts, getAllProjects } from "@/utils/mdxServer";
import { HomeClient } from "./pageClient";
import "swiper/css";
import { fetchGithubUserInfo } from "@/api/github";
import DefaultLayout from "@/layout/DefaultLayout";

export default async function Home() {
  const projectData = await getAllProjects();
  const { postList, totalPostCount } = await getAllPosts({ maxCount: 3 });
  const githubData = await fetchGithubUserInfo();

  return (
    <DefaultLayout>
      <HomeClient
        projectData={projectData}
        postList={postList}
        postCount={totalPostCount}
        githubData={githubData}
      />
    </DefaultLayout>
  );
}
