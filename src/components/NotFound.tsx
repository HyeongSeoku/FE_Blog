"use client";

import Link from "next/link";
import GithubIssueIcon from "@/icon/github_issue.svg";
import GitHubIssueButton from "./GithubIssueButton";

const NotFound = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="fade-in flex flex-col gap-3">
        <span className="text-label text-muted">Error</span>
        <h1 className="text-[clamp(3.5rem,14vw,7rem)] font-bold leading-none text-theme">
          404
        </h1>
        <p className="text-body leading-[var(--line-intro)] text-muted">
          페이지를 찾을 수 없습니다. 주소가 바뀌었거나 더 이상 존재하지 않는
          페이지입니다.
        </p>
      </div>

      <nav
        className="fade-in flex flex-wrap items-center gap-3"
        style={{ animationDelay: "80ms" }}
      >
        <Link
          className="rounded-full bg-opposite-theme px-5 py-2.5 text-meta font-medium text-opposite-theme transition-opacity hover:opacity-[.85]"
          href="/"
          replace
        >
          홈으로
        </Link>
        <GitHubIssueButton className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2.5 text-meta text-muted transition-colors hover:border-theme hover:text-theme">
          <GithubIssueIcon style={{ width: 14, height: 14 }} />
          이슈 신고하기
        </GitHubIssueButton>
      </nav>
    </section>
  );
};

export default NotFound;
