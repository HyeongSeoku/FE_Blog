"use client";

import Link from "next/link";
import GitHubIssueButton from "./GithubIssueButton";

const NotFound = () => {
  return (
    <section className="w-full h-full px-8 md:px-4 flex flex-col">
      <div className="flex flex-col items-center gap-2 my-auto">
        <h1 className="text-3xl font-bold">404 Not found</h1>
        <div className="text-lg flex flex-col text-center">
          <span>페이지를 찾을 수 없습니다</span>
          <span>페이지가 이동되거나 변경되었습니다.</span>
        </div>

        <nav className="flex flex-col items-center">
          <Link
            className="rounded-md bg-primary hover:bg-primary-hover py-2 px-3 transition-[background-color] duration-300 mt-5"
            href="/"
            replace
          >
            홈으로
          </Link>
          <GitHubIssueButton className="rounded-md py-2 px-3 transition-[background-color] duration-300 mt-5">
            이슈 신고하기
          </GitHubIssueButton>
        </nav>
      </div>
    </section>
  );
};

export default NotFound;
