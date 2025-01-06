"use client";

import React from "react";
import useIssueInfo from "@/hooks/useIssueInfo";
import GitIssueIcon from "@/icon/warn_msg_icon.svg";

const GitHubIssueButton = () => {
  const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;
  const { title, body } = useIssueInfo();

  const issueUrl = `${repoUrl}/issues/new?title=${encodeURIComponent(
    `${title}`,
  )}&body=${encodeURIComponent(`${body}`)}`;

  return (
    <a href={issueUrl} target="_blank" rel="noopener noreferrer">
      <button className="ml-1 h-10 w-10 flex items-center justify-center relative hover:bg-gray-400/20 rounded-sm">
        <GitIssueIcon width={20} height={20} />
      </button>
    </a>
  );
};

export default GitHubIssueButton;
