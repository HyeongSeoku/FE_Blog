import { NAV_GITHUB_ISSUE, NAV_LIST } from "@/constants/navigation.constants";
import useIssueInfo from "@/hooks/useIssueInfo";
import useScrollDisable from "@/hooks/useScrollDisable";
import classNames from "classnames";
import Link from "next/link";

export interface MobileNavigationProps {
  isOpen: boolean;
  toggleMoMenu: () => void;
}

const MobileNavigation = ({ isOpen, toggleMoMenu }: MobileNavigationProps) => {
  useScrollDisable(isOpen);
  const { title, body } = useIssueInfo();
  const issueQueryString = `title=${encodeURIComponent(
    `${title}`,
  )}&body=${encodeURIComponent(`${body}`)}`;

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
    <nav
      className={`fixed inset-0 pt-16 flex flex-col bg-[var(--bg-color)] shadow-lg transform z-20 
         transition-[opacity,transform,height] ${
           isOpen
             ? "opacity-100 translate-y-0 h-dvh w-dvw duration-300"
             : "opacity-0 -translate-y-full h-0 duration-300"
         }`}
    >
      <ul className={classNames("h-dvh", isOpen ? "visible" : "hidden")}>
        {NAV_LIST.map(({ id, title, link, isExternalLink, target }, idx) => (
          <li
            key={`${id}_${idx}`}
            className="px-4 py-2 cursor-pointer flex max-w-[var(--mobile-nav-max-width)]"
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
    </nav>
  );
};

export default MobileNavigation;
