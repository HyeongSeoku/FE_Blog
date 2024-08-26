import { NAV_LIST } from "@/constants/navigation.constants";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export interface MobileNavigationProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileNavigation = ({ isOpen, setIsOpen }: MobileNavigationProps) => {
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 bottom-0 left-0 right-0 pt-10 flex flex-col bg-[var(--bg-color)] shadow-lg transition-all duration-300 transform w-full z-10 ${
        isOpen
          ? "opacity-100 translate-y-0 h-full"
          : "opacity-0 -translate-y-full h-0"
      }`}
    >
      <ul className={`${isOpen ? "visible" : "hidden"}`}>
        {NAV_LIST.map(({ title, link }, idx) => (
          <li
            key={`${title}_${idx}`}
            className="px-4 py-2 cursor-pointer flex ml-auto mr-auto max-w-[var(--max-width)]"
          >
            <Link
              href={link}
              className="w-full h-full"
              onClick={handleLinkClick}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigation;
