"use client";

import { ReactNode, useEffect, useState } from "react";
import BackButton from "./backButton";
import MenuIcon from "@/icon/menu.svg";
import SunIcon from "@/icon/sun.svg";
import MoonIcon from "@/icon/moon.svg";

import { useRouter } from "next/navigation";
import MobileNavigation from "@/components/MobileNavigation";
import useThemeStore from "@/store/theme";
import useTheme from "@/hooks/useTheme";
import useScrollDirection from "@/hooks/useScrollDirection";
import classNames from "classnames";
import { triggerAnimation } from "@/utils/styles";
import { HEADER_SCROLL_THRESHOLD } from "@/constants/basic.constants";

export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
  initialTheme?: string;
  hasAnimation?: boolean;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({
  headerType,
  children,
  initialTheme,
  hasAnimation = false,
}: HeaderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMoNavOpen, setIsMoNavOpen] = useState(false);
  const { isDarkMode, setDarkMode, setLightMode } = useThemeStore();
  const isDarkTheme = isMounted ? isDarkMode : initialTheme === "dark";
  const router = useRouter();
  const scrollDirection = useScrollDirection(HEADER_SCROLL_THRESHOLD);

  useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      setLightMode();
      return;
    }

    setDarkMode();
  };

  const toggleMoMenu = () => {
    const breadOpenStatusText = isMoNavOpen ? "close" : "open";
    triggerAnimation("id", `bread-top-${breadOpenStatusText}`);
    triggerAnimation("id", `bread-bottom-${breadOpenStatusText}`);
    setIsMoNavOpen(!isMoNavOpen);
  };

  const handleLogoButton = () => {
    router.push("/");
  };

  return (
    <header
      className={classNames(
        "sticky left-0 right-0 z-10 h-14 py-2 flex items-center px-8 w-full box-border backdrop-blur-sm transition-[top,opacity] duration-300 md:px-4",
        {
          "top-0 opacity-1": !hasAnimation || scrollDirection === "up",
          "-top-14 opacity-0": hasAnimation && scrollDirection === "down",
        },
      )}
    >
      {headerType === "DEFAULT" && (
        <button
          className={`z-10 flex gap-2 items-center ${isMoNavOpen ? "opacity-0 transition-opacity" : "opacity-100"}`}
          onClick={handleLogoButton}
        >
          <h1 className="text-3xl font-bold transition-[color] text-primary hover:text-primary-hover md:text-2xl">
            SEOKU
          </h1>
        </button>
      )}
      {headerType === "BACK" && <BackButton />}
      {children && <>{children}</>}

      <div className="flex items-center ml-auto">
        <button
          className="flex flex-col flex-shrink-0 w-10 h-10 overflow-hidden hover:bg-gray-400/20 rounded-sm"
          onClick={toggleTheme}
        >
          <div
            className={`flex flex-col flex-shrink-0 w-10 h-20 transition-transform duration-200 ease-in-out ${
              isDarkTheme ? "transform translate-y-[-2.5rem]" : ""
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 hover:animate-rotateFull">
              <SunIcon width={24} height={24} />
            </div>
            <div className="flex items-center justify-center w-10 h-10 hover:animate-rotateQuarter">
              <MoonIcon width={24} height={24} />
            </div>
          </div>
        </button>
        <button
          className="ml-1 h-10 w-10 flex items-center justify-center relative z-30 hover:bg-gray-400/20 rounded-sm"
          onClick={toggleMoMenu}
        >
          <MenuIcon width={24} height={24} alt="menu" />
        </button>
      </div>
      <MobileNavigation isOpen={isMoNavOpen} toggleMoMenu={toggleMoMenu} />
    </header>
  );
};

export default Header;
