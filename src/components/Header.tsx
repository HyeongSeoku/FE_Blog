"use client";

import { ReactNode, useEffect } from "react";
import BackButton from "./backButton";
import MenuIcon from "@/icon/menu.svg";
import { useRouter } from "next/navigation";
import MobileNavigation from "@/components/MobileNavigation";
import useScrollDirection from "@/hooks/useScrollDirection";
import classNames from "classnames";
import { triggerAnimation } from "@/utils/styles";
import {
  HEADER_SCROLL_THRESHOLD,
  MOBILE_WIDTH,
} from "@/constants/basic.constants";
import ThemeButton from "./ThemeButton/ThemeButton";
import Navigation from "@/components/Navigation";
import Logo from "@/icon/logo.svg";
import useMobileNavStore from "@/store/mobileNav";

export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
  hasAnimation?: boolean;
  hideNavigation?: boolean;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({
  headerType,
  children,
  hasAnimation = false,
  hideNavigation = false,
}: HeaderProps) => {
  const { isOpen: isMoNavOpen, setIsOpen: setIsMoNavOpen } =
    useMobileNavStore();
  const router = useRouter();
  const scrollDirection = useScrollDirection(HEADER_SCROLL_THRESHOLD);

  // 화면 크기가 태블릿 이상으로 변경되면 모바일 메뉴 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MOBILE_WIDTH && isMoNavOpen) {
        triggerAnimation("id", "bread-top-close");
        triggerAnimation("id", "bread-bottom-close");
        setIsMoNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMoNavOpen, setIsMoNavOpen]);

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
        "sticky left-0 right-0 z-20 h-14 py-2 flex items-center px-8 w-full box-border backdrop-blur-sm transition-[top,opacity] duration-300 mobile:px-4",
        {
          "top-0 opacity-1": !hasAnimation || scrollDirection === "up",
          "-top-14 opacity-0": hasAnimation && scrollDirection === "down",
        },
      )}
    >
      {headerType === "DEFAULT" && (
        <button
          type="button"
          className={`z-10 flex gap-2 items-center ${isMoNavOpen ? "opacity-0 transition-opacity" : "opacity-100"}`}
          onClick={handleLogoButton}
        >
          <Logo
            width={90}
            height={30}
            className="text-3xl font-bold transition-[color] text-primary hover:text-primary-hover mobile:text-2xl"
          />
        </button>
      )}
      {headerType === "BACK" && <BackButton />}
      {children && <>{children}</>}
      {!hideNavigation && (
        <>
          <Navigation className="ml-4 mobile:hidden" />
          <div className="flex items-center ml-auto gap-2">
            <ThemeButton />

            <button
              className={classNames(
                "ml-1 h-10 w-10 flex items-center justify-center relative z-50 hover:bg-gray-400/20 rounded-sm",
                "tablet:hidden",
              )}
              onClick={toggleMoMenu}
            >
              <MenuIcon title="menu" style={{ width: 24, height: 24 }} />
            </button>
          </div>
          <MobileNavigation isOpen={isMoNavOpen} toggleMoMenu={toggleMoMenu} />
        </>
      )}
    </header>
  );
};

export default Header;
