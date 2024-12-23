import { getAllPosts, getAllProjects } from "@/utils/mdxServer";
import { HomeClient } from "./pageClient";
import "swiper/css";

export default async function Home() {
  const projectData = await getAllProjects();
  const postData = await getAllPosts();

  return <HomeClient projectData={projectData} postData={postData} />;
}
