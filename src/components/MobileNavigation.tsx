"use client";

import { Drawer, DrawerContent, DrawerTitle } from "@seoku/design-system";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GITHUB_ISSUE, NAV_LIST } from "@/constants/navigation.constants";
import useIssueInfo from "@/hooks/useIssueInfo";
import { issueUrl } from "@/utils/util";

export interface MobileNavigationProps {
  isOpen: boolean;
  toggleMoMenu: () => void;
  className?: string;
}

const MobileNavigation = ({
  isOpen,
  toggleMoMenu,
  className = "",
}: MobileNavigationProps) => {
  const { title, body } = useIssueInfo();
  const issueQueryString = issueUrl(title, body);

  const pathname = usePathname();
  const baseSegment = pathname.split("/").filter(Boolean)[0];
  const basePathname = baseSegment ? `/${baseSegment}` : "/";

  const handleLinkClick = () => {
    toggleMoMenu();
  };

  const handleExternalLink = (link: string, id: string) => {
    const externalLink = link.startsWith("http") ? link : `https://${link}`;
    if (id === NAV_GITHUB_ISSUE) {
      return `${externalLink}?${issueQueryString}`;
    }

    return externalLink;
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMoMenu();
      }}
    >
      <DrawerContent
        side="top"
        className={classNames(
          "!inset-0 !h-dvh !w-dvw !border-0 !shadow-lg !rounded-none",
          "!bg-[var(--bg-color)] !pt-16 !flex !flex-col",
          "[&>button]:!hidden",
          "tablet:!hidden",
          className,
        )}
      >
        <DrawerTitle className="sr-only">모바일 내비게이션</DrawerTitle>
        <ul className="h-dvh">
          {NAV_LIST.map(({ id, title, link, isExternalLink, target }) => (
            <li
              key={id}
              className={classNames(
                "px-5 py-3 cursor-pointer flex max-w-[var(--mobile-nav-max-width)] text-h2 transition-opacity hover:opacity-[.55]",
                link === basePathname ? "text-theme" : "text-muted",
              )}
            >
              {isExternalLink ? (
                <a
                  href={handleExternalLink(link, id)}
                  target={target ?? "_blank"}
                  rel="noopener noreferrer"
                  className="w-full h-full"
                  onClick={handleLinkClick}
                >
                  {title}
                </a>
              ) : (
                <Link
                  href={link}
                  className="w-full h-full"
                  onClick={handleLinkClick}
                  target={target}
                >
                  {title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavigation;
