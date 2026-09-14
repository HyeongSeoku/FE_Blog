"use client";

import type { ReactNode } from "react";
import useIssueInfo from "@/hooks/useIssueInfo";

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
    <a
      href={issueUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Report Issue Button"
      aria-label="Report Issue Button"
      className={className}
    >
      {children ?? <span className="sr-only">Report Issue</span>}
    </a>
  );
};

export default GitHubIssueButton;
