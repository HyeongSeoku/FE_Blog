import { notFound } from "next/navigation";
import { getProjectDetail } from "@/utils/mdx";
import ProjectDetailPageClient from "./pageClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const projectData = await getProjectDetail(params.slug);

  console.log("TEST projectData", projectData);

  if (!projectData) {
    notFound();
  }

  return (
    <ProjectDetailPageClient
      source={projectData.source}
      frontMatter={projectData.frontMatter}
    />
  );
}
