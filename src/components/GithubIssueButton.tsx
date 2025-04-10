"use client";

import React, { ReactNode } from "react";
import useIssueInfo from "@/hooks/useIssueInfo";
import GithubIssueIcon from "@/icon/github_issue.svg";

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
          "ml-1 h-10 px-2 py-1 min-w-10 w-fit flex items-center justify-center rounded-sm",
          "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400/20",
          className,
        )}
      >
        <GithubIssueIcon style={{ width: 24, height: 24 }} />

        {children}
      </button>
    </a>
  );
};

export default GitHubIssueButton;
