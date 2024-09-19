import DefaultLayout from "@/layout/DefaultLayout";
import { getAllProjects } from "@/utils/mdx";
import { HomeClient } from "./pageClient";
// import "swiper/react";
import "swiper/css";

export default function Home() {
  const projectData = getAllProjects();

  return (
    <DefaultLayout>
      <HomeClient projectData={projectData} />
    </DefaultLayout>
  );
}
