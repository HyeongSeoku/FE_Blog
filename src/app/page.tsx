import { getAllPosts, getAllProjects } from "@/utils/mdxServer";
import { HomeClient } from "./pageClient";
import "swiper/css";
import { fetchGithubUserInfo } from "@/api/github";

export default async function Home() {
  const projectData = await getAllProjects();
  const postData = await getAllPosts();
  const githubData = await fetchGithubUserInfo();

  return (
    <HomeClient
      projectData={projectData}
      postData={postData}
      githubData={githubData}
    />
  );
}
