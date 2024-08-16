"use client";

import { ReactNode, useEffect, useState } from "react";
import BackButton from "./backButton";
import MenuIcon from "@/icon/menu.svg";
import { useRouter } from "next/navigation";
import MobileNavigation from "../MobileNavigation";
export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({ headerType, children }: HeaderProps) => {
  const [isMoNavOpen, setIsMoNavOpen] = useState(false);
  const router = useRouter();

  const triggerAnimation = (id: string) => {
    const element = document.getElementById(id) as unknown;
    console.log("TEST ", element);

    if (element instanceof SVGAnimateElement) {
      element.beginElement();
    }
  };

  const toggleMoMenu = () => {
    if (!isMoNavOpen) {
      // Open animations
      // triggerAnimation("bread-top-open");
      // triggerAnimation("bread-bottom-open");
      setIsMoNavOpen(true);
    } else {
      // Close animations
      // triggerAnimation("bread-top-close");
      // triggerAnimation("bread-bottom-close");
      setIsMoNavOpen(false);
    }
  };
  const handleLogoButton = () => {
    router.push("/");
  };

  return (
    <header className="flex pb-2 w-full">
      {headerType === "DEFAULT" && (
        <button onClick={handleLogoButton}>LOGO</button>
      )}
      {headerType === "BACK" && <BackButton />}
      {children && <>{children}</>}

      <button className="hamburger-container" onClick={toggleMoMenu}>
        <MenuIcon
          width={18}
          height={18}
          fill="black"
          className={`transition-transform duration-300 ease-in-out transform ${
            isMoNavOpen ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>

      <MobileNavigation isOpen={isMoNavOpen} setIsOpen={setIsMoNavOpen} />
    </header>
  );
};

export default Header;
