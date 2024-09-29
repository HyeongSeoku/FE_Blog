"use client";

import { ReactNode, useEffect, useState } from "react";
import BackButton from "./backButton";
import MenuIcon from "@/icon/menu.svg";
import LightIcon from "@/icon/light.svg";
import DarkIcon from "@/icon/dark.svg";
import LogoIcon from "@/icon/logo.svg";
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
  const [isMounted, setIsMounted] = useState(false);
  const [isMoNavOpen, setIsMoNavOpen] = useState(false);
  const { isDarkMode, setDarkMode, setLightMode } = useThemeStore();
  const router = useRouter();
  useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const toggleTheme = () => {
    if (isDarkMode) {
      setLightMode();
      return;
    }

    setDarkMode();
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

  const handleLogoButton = () => {
    router.push("/");
  };

  return (
    <header className="flex px-4 py-2 w-full box-border justify-between">
      <button
        className="flex flex-col flex-shrink-0 w-10 h-10 overflow-hidden"
        onClick={toggleTheme}
      >
        <div
          className={`flex flex-col flex-shrink-0 w-10 h-20 transition-transform duration-200 ease-in-out ${
            isMounted && isDarkMode ? "transform translate-y-[-2.5rem]" : ""
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 hover:animate-rotateFull">
            <LightIcon width={24} height={24} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 hover:animate-rotateQuarter">
            <DarkIcon width={24} height={24} />
          </div>
        </div>
      </button>
      {headerType === "DEFAULT" && (
        <button
          className={`z-10 flex gap-2 items-center ${isMoNavOpen ? "opacity-0 transition-opacity" : "opacity-100"}`}
          onClick={handleLogoButton}
        >
          <LogoIcon width={30} height={30} />
          <h1 className="text-3xl font-bold">SEOKU</h1>
        </button>
      )}
      {headerType === "BACK" && <BackButton />}
      {children && <>{children}</>}

      <button
        className="ml-1 h-10 w-10 flex items-center justify-center relative z-30"
        onClick={toggleMoMenu}
      >
        <MenuIcon width={24} height={24} fill="black" />
      </button>

      <MobileNavigation isOpen={isMoNavOpen} setIsOpen={setIsMoNavOpen} />
    </header>
  );
};

export default Header;
