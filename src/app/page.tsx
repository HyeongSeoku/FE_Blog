import DefaultLayout from "@/layout/DefaultLayout";
import { getAllPosts, getAllProjects } from "@/utils/mdx";
import { HomeClient } from "./pageClient";
import "swiper/css";

export default async function Home() {
  const projectData = await getAllProjects();
  const postData = await getAllPosts();

  return (
    <DefaultLayout>
      <HomeClient projectData={projectData} postData={postData} />
    </DefaultLayout>
  );
}
