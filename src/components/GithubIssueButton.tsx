"use client";

import React, { ReactNode } from "react";
import useIssueInfo from "@/hooks/useIssueInfo";
import GithubIcon from "@/icon/github.svg";

import classNames from "classnames";

export interface GithubIssueButtonProps {
  children?: ReactNode;
  className?: string;
}

const GitHubIssueButton = ({
  children,
  className = "",
}: GithubIssueButtonProps) => {
  const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;
  const { title, body } = useIssueInfo();

  const issueUrl = `${repoUrl}/issues/new?title=${encodeURIComponent(
    `${title}`,
  )}&body=${encodeURIComponent(`${body}`)}`;

  return (
    <a href={issueUrl} target="_blank" rel="noopener noreferrer">
      <button
        className={classNames(
          "ml-1 h-10 min-w-10 w-fit flex items-center justify-center rounded-sm",
          "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400/20",
          className,
        )}
      >
        <GithubIcon width={20} height={20} />
        {children}
      </button>
    </a>
  );
};

export default GitHubIssueButton;
