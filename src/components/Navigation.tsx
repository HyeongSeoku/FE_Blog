"use client";

import {
  NAV_GITHUB_ISSUE,
  NAV_LIST,
  NAV_LIST_TYPE,
} from "@/constants/navigation.constants";
import useIssueInfo from "@/hooks/useIssueInfo";
import { issueUrl } from "@/utils/util";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavigationItem({
  item,
  handleExternalLink,
}: {
  item: NAV_LIST_TYPE;
  handleExternalLink: (link: string, id: string) => string;
}) {
  const pathname = usePathname();
  const pathBaseUrl = `/${pathname.split("/")[1]}`;

  const { id, link, title, isExternalLink, target, baseUrl } = item;
  const isSelected = baseUrl?.includes(pathBaseUrl);

  return (
    <li
      className={classNames(
        "transition-opacity duration-300 hover:opacity-100",
        { "opacity-50": !isSelected, "opacity-100": isSelected },
      )}
    >
      {isExternalLink ? (
        <a
          href={handleExternalLink(link, id)}
          target={target ?? "_blank"}
          rel="noopener noreferrer"
          className="w-full h-full"
        >
          {title}
        </a>
      ) : (
        <Link href={link} className="w-full h-full" target={target}>
          {title}
        </Link>
      )}
    </li>
  );
}

export interface NavigationProps {
  className?: string;
}

function Navigation({ className = "" }: NavigationProps) {
  const { title, body } = useIssueInfo();
  const issueQueryString = issueUrl(title, body);

  const handleExternalLink = (link: string, id: string) => {
    const externalLink = link.startsWith("http") ? link : `https://${link}`;
    if (id === NAV_GITHUB_ISSUE) {
      return `${externalLink}?${issueQueryString}`;
    }

    return externalLink;
  };

  return (
    <nav className={classNames(className)}>
      <ul className="flex gap-4 font-semibold text-lg">
        {NAV_LIST.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            handleExternalLink={handleExternalLink}
          />
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
