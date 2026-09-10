"use client";

import Link from "next/link";
import GitHubIssueButton from "./GithubIssueButton";

const NotFound = () => {
  return (
    <section className="w-full h-full px-8 mobile:px-4 flex flex-col">
      <div className="flex flex-col items-center gap-2 my-auto">
        <h1 className="text-sk-h1 font-bold text-theme">404 Not found</h1>
        <div className="text-sk-body flex flex-col text-center text-muted">
          <span>페이지를 찾을 수 없습니다</span>
          <span>페이지가 이동되거나 변경되었습니다.</span>
        </div>

        <nav className="flex flex-col items-center gap-2 mt-5">
          <Link
            className="text-sk-meta text-theme transition-opacity hover:opacity-[.55]"
            href="/"
            replace
          >
            홈으로
          </Link>
          <GitHubIssueButton className="text-sk-meta text-muted transition-opacity hover:opacity-[.55]">
            이슈 신고하기
          </GitHubIssueButton>
        </nav>
      </div>
    </section>
  );
};

export default NotFound;
