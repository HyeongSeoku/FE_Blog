import Image from "next/image";
import ExternalIcon from "@/icon/external.svg";

interface Project {
  name: string;
  period: string;
  thumbnail?: string;
  url?: string;
  /** 카드마다 살짝씩 다른 가로형 비율을 줘서 벤또 그리드에 높낮이 변화를 만든다 */
  aspect: "21/9" | "16/9" | "3/2";
}

// TODO: 실제 프로젝트 데이터로 교체. 벤또 그리드 확인용 샘플 3개.
const PROJECTS: Project[] = [
  {
    name: "sseoku.com",
    period: "2024.08 ~ 운영 중",
    url: "https://sseoku.com",
    aspect: "16/9",
  },
  {
    name: "예시 프로젝트 A",
    period: "2024.01 ~ 2024.03",
    aspect: "3/2",
  },
  {
    name: "예시 프로젝트 B",
    period: "2023.05 ~ 2023.09",
    aspect: "21/9",
  },
];

const ASPECT_CLASS: Record<Project["aspect"], string> = {
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
};

const PortfolioProjects = () => {
  return (
    <section className="mt-16 flex flex-col gap-8 tablet:mt-24">
      <h2 className="text-label text-muted">Projects</h2>

      <div className="columns-1 gap-6 tablet:columns-2">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="group/card mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-hairline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* 가로로 긴 비주얼 영역 — 카드마다 비율이 조금씩 달라 높이에 변화를 준다 */}
            <div
              className={`relative w-full overflow-hidden bg-[var(--bg-gray-color)] ${ASPECT_CLASS[project.aspect]}`}
            >
              {project.thumbnail && (
                <Image
                  src={project.thumbnail}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} 방문하기`}
                  className="absolute bottom-3 left-3 z-10 flex size-8 items-center justify-center rounded-full bg-opposite-theme text-opposite-theme opacity-0 backdrop-blur-md transition-opacity group-hover/card:opacity-100"
                >
                  <ExternalIcon style={{ width: 14, height: 14 }} />
                </a>
              )}
            </div>

            {/* 캡션 바 — 제목 + 기간, 가로 배치 */}
            <div className="flex items-center justify-between gap-3 bg-[var(--bg-gray-color)] px-4 py-3">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-meta font-medium text-theme transition-opacity hover:opacity-[.55]"
                >
                  {project.name}
                </a>
              ) : (
                <span className="text-meta font-medium text-theme">
                  {project.name}
                </span>
              )}
              <span className="shrink-0 text-label uppercase tracking-wider text-muted">
                {project.period}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioProjects;
