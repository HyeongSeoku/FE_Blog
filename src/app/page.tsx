import DefaultLayout from "@/layout/DefaultLayout";
import { getAllProjects } from "@/utils/mdx";
import { HomeClient } from "./pageClient";

export default function Home() {
  const data = getAllProjects();

  return (
    <DefaultLayout>
      <HomeClient />
    </DefaultLayout>
  );
}
