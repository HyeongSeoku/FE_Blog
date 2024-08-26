"use client";

import { ReactNode, useEffect, useState } from "react";
import BackButton from "./backButton";
import MenuIcon from "@/icon/menu.svg";
import LightIcon from "@/icon/light.svg";
import { useRouter } from "next/navigation";
import MobileNavigation from "@/components/MobileNavigation";
import useThemeStore from "@/store/theme";
import useTheme from "@/hooks/useTheme";

export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({ headerType, children }: HeaderProps) => {
  const [isMoNavOpen, setIsMoNavOpen] = useState(false);
  const { isDarkMode, setDarkMode, setLightMode } = useThemeStore();
  const router = useRouter();
  useTheme();

  const triggerAnimation = (type: "id" | "class", target: string) => {
    let elements: NodeListOf<SVGAnimateElement> | SVGAnimateElement | null =
      null;

    if (type === "id") {
      elements = document.getElementById(target) as SVGAnimateElement | null;
      if (elements) {
        elements.beginElement();
      }
    } else if (type === "class") {
      elements = document.querySelectorAll(`.${target}`);
      elements.forEach((element) => {
        if (element instanceof SVGAnimateElement) {
          element.beginElement();
        }
      });
    }
  };

  const toggleMoMenu = () => {
    if (!isMoNavOpen) {
      // Open animations
      triggerAnimation("id", "bread-top-open");
      triggerAnimation("id", "bread-bottom-open");
      setIsMoNavOpen(true);
    } else {
      // Close animations
      triggerAnimation("id", "bread-top-close");
      triggerAnimation("id", "bread-bottom-close");
      setIsMoNavOpen(false);
    }
  };

  const toggleTheme = () => {
    if (!isDarkMode) {
      triggerAnimation("class", "dark-mode");
      triggerAnimation("id", "dark-mode-center");
      setDarkMode();
    } else {
      triggerAnimation("class", "light-mode");
      triggerAnimation("id", "light-mode-center");
      setLightMode();
    }
  };

  const handleLogoButton = () => {
    router.push("/");
  };

  useEffect(() => {
    if (isDarkMode) {
      triggerAnimation("class", "dark-mode");
      triggerAnimation("id", "dark-mode-center");
    } else {
      triggerAnimation("class", "light-mode");
      triggerAnimation("id", "light-mode-center");
    }
  }, [isDarkMode]);

  return (
    <header className="flex pb-2 w-full h-10 box-border relative">
      {headerType === "DEFAULT" && (
        <button
          className={`z-10 duration-[var(--transition-duration)] ${isMoNavOpen ? "opacity-0 transition-opacity" : "opacity-100"}`}
          onClick={handleLogoButton}
        >
          LOGO
        </button>
      )}
      {headerType === "BACK" && <BackButton />}
      {children && <>{children}</>}

      <button className="ml-auto z-20" onClick={toggleTheme}>
        <LightIcon width={18} height={18} fill="black" />
      </button>

      <button className="ml-1 relative z-20" onClick={toggleMoMenu}>
        <MenuIcon width={18} height={18} fill="black" />
      </button>

      <MobileNavigation isOpen={isMoNavOpen} setIsOpen={setIsMoNavOpen} />
    </header>
  );
};

export default Header;
