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
import ScrollProgressBar from "./ScrollProgressBar";
import useScrollDirection from "@/hooks/useScrollDirection";
import classNames from "classnames";

export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
  initialTheme?: string;
  showScrollProgress?: boolean;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({
  headerType,
  children,
  initialTheme,
  showScrollProgress = false,
}: HeaderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMoNavOpen, setIsMoNavOpen] = useState(false);
  const { isDarkMode, setDarkMode, setLightMode } = useThemeStore();
  const isDarkTheme = isMounted ? isDarkMode : initialTheme === "dark";
  const router = useRouter();
  const scrollDirection = useScrollDirection(50);

  useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, [initialTheme, setDarkMode, setLightMode]);

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
        "sticky top-0 left-0 right-0 z-10 flex items-center px-4 w-full max-w-7xl box-border backdrop-blur-sm transition-[height] duration-300 overflow-hidden",
        {
          "h-14 py-2": scrollDirection === "up",
          "h-0 py-0": scrollDirection === "down",
        },
      )}
    >
      {headerType === "DEFAULT" && (
        <button
          className={`z-10 flex gap-2 items-center ${isMoNavOpen ? "opacity-0 transition-opacity" : "opacity-100"}`}
          onClick={handleLogoButton}
        >
          <h1 className="text-3xl font-bold">SEOKU</h1>
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
      {/* FIXME: ScrollProgressBar 미노출 이슈 수정  */}
      {showScrollProgress && <ScrollProgressBar />}
      <MobileNavigation isOpen={isMoNavOpen} toggleMoMenu={toggleMoMenu} />
    </header>
  );
};

export default Header;
