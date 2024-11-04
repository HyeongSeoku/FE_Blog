import { notFound } from "next/navigation";
import { getProjectDetail } from "@/utils/mdx";
import ProjectDetailPageClient from "./pageClient";
import { Suspense } from "react";
import { MdxContentSkeleton } from "@/components/shared/MdxContentSkeleton";

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
