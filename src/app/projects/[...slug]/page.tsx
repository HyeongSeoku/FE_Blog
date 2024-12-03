import { notFound } from "next/navigation";
import { getAllProjects, getProjectDetail } from "@/utils/mdxServer";
import ProjectDetailPageClient from "./pageClient";
import { Suspense } from "react";
import { MdxContentSkeleton } from "@/components/MdxContentSkeleton";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug.split("/") }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const projectData = await getProjectDetail(params.slug);

  if (!projectData) {
    notFound();
  }

  return (
    <>
      <h1>{projectData?.frontMatter.title}</h1>
      <Suspense fallback={<MdxContentSkeleton />}>
        <ProjectDetailPageClient source={projectData.source} />
      </Suspense>
    </>
  );
}
