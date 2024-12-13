import { NAV_LIST } from "@/constants/navigation.constants";
import useScrollDisable from "@/hooks/useScrollDisable";
import classNames from "classnames";
import Link from "next/link";

export interface MobileNavigationProps {
  isOpen: boolean;
  toggleMoMenu: () => void;
}

const MobileNavigation = ({ isOpen, toggleMoMenu }: MobileNavigationProps) => {
  const handleLinkClick = () => {
    toggleMoMenu();
  };

  useScrollDisable(isOpen);

  return (
    <nav
      className={`fixed top-0 bottom-0 left-0 right-0 pt-10 flex flex-col bg-[var(--bg-color)] shadow-lg transition-all duration-300 transform z-20 h-fit${
        isOpen
          ? "opacity-100 translate-y-0 h-fit w-dvw"
          : "opacity-0 -translate-y-full h-0"
      }`}
    >
      <ul className={classNames("h-dvh", isOpen ? "visible" : "hidden")}>
        {NAV_LIST.map(({ title, link, isExternalLink, target }, idx) => (
          <li
            key={`${title}_${idx}`}
            className="px-4 py-2 cursor-pointer flex max-w-[var(--mobile-nav-max-width)]"
          >
            {isExternalLink ? (
              <a
                href={link.startsWith("http") ? link : `https://${link}`}
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
