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
    <nav>
      <ul
        className={`absolute top-7 bottom-0 left-0 right-0 flex flex-col bg-white shadow-lg transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-7 w-full h-full"
            : "opacity-0 -translate-y-full w-0 h-0"
        }`}
      >
        {NAV_LIST.map(({ title, link }, idx) => (
          <li key={`${title}_${idx}`} className="px-4 py-2 cursor-pointer flex">
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
