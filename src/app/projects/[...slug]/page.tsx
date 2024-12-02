import { notFound } from "next/navigation";
import { getAllProjects, getProjectDetail } from "@/utils/mdxServer";
import ProjectDetailPageClient from "./pageClient";
import { Suspense } from "react";
import { MdxContentSkeleton } from "@/components/MdxContentSkeleton";
import { headers } from "next/headers";
import { parseCookieHeader } from "@/utils/cookies";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug.split("/") }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const cookieHeader = headers().get("cookie");
  const cookies = parseCookieHeader(cookieHeader);
  const theme = cookies.LIGHT_DARK_THEME;

  const projectData = await getProjectDetail(params.slug, theme);

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
