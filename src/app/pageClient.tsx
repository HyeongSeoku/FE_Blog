"use client";

import ProjectCard from "@/components/ProjectCard";
import useDeviceType from "@/hooks/useDeviceType";
import { ProjectDataProps } from "@/utils/mdx";

interface HomeClientProps {
  projectData: ProjectDataProps[];
}

export const HomeClient = ({ projectData }: HomeClientProps) => {
  useDeviceType();

  return (
    <div className="h-full">
      <section className="flex flex-col items-center justify-center lg:text-3xl  xs:text-2xl pt-16 pb-20">
        <h2>안녕하세요</h2>
        <h2>
          <b
            className="text-4xl font-medium animate-easeInTypingEffect text-primary relative"
            style={{ fontFamily: "var(--font-family2)" }}
          >
            섬세함
            <span className="absolute right-0 left-0 bottom-0 h-3 bg-primary opacity-20"></span>
          </b>
          을 추구하는
        </h2>
        <h2>개발자 김형석입니다.</h2>
      </section>

      <section className="flex flex-col items-center justify-center lg:text-3xl  xs:text-2xl">
        <h2>배우는 것에 즐거움을 느끼는</h2>
        <h2>프론트엔드 개발자입니다.</h2>
      </section>

      <section>
        <ul className="grid md:grid-cols-4">
          {projectData.map(
            ({ title, description, startDate, endDate, tags, slug }) => (
              <ProjectCard
                key={slug}
                title={title}
                description={description}
                startDate={startDate}
                endDate={endDate}
                link={`/projects/${slug}`}
                tags={tags}
              />
            ),
          )}
        </ul>
      </section>
    </div>
  );
};