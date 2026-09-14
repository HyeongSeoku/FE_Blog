"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@seoku/design-system";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NAV_GITHUB_ISSUE,
  NAV_LIST,
  type NAV_LIST_TYPE,
} from "@/constants/navigation.constants";
import useIssueInfo from "@/hooks/useIssueInfo";
import { issueUrl } from "@/utils/util";

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

  const itemClassName = classNames(
    "transition-colors duration-200 hover:text-theme",
    isSelected ? "text-theme" : "text-muted",
  );

  return (
    <NavigationMenuItem className={itemClassName}>
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
    </NavigationMenuItem>
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
    <NavigationMenu className={classNames("!max-w-none !flex-none", className)}>
      <NavigationMenuList className="!gap-4 !font-normal !text-meta !justify-start">
        {NAV_LIST.filter((item) => !item.isMobile).map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            handleExternalLink={handleExternalLink}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navigation;
