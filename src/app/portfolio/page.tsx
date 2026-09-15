import type { Metadata } from "next";
import PortfolioProjects from "./PortfolioProjects";

export const metadata: Metadata = {
  title: "SEOK 개발블로그 | 포트폴리오",
  description: "프론트엔드 개발자로서 진행한 프로젝트를 정리합니다.",
  alternates: { canonical: "/portfolio" },
  openGraph: { url: "/portfolio" },
};

const PortfolioPage = () => {
  return (
    <>
      <header className="flex flex-col gap-3 pt-6 tablet:pt-12">
        <span className="text-label text-muted">Portfolio</span>
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-theme">
          포트폴리오
        </h1>
        <p className="max-w-[560px] text-body leading-[var(--line-intro)] text-muted">
          프론트엔드 개발자로서 진행한 프로젝트를 정리합니다.
        </p>
      </header>

      <PortfolioProjects />
    </>
  );
};

export default PortfolioPage;
