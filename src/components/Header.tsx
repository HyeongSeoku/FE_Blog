"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import MobileNavigation from "@/components/MobileNavigation";
import Navigation from "@/components/Navigation";
import { MOBILE_WIDTH } from "@/constants/basic.constants";
import Logo from "@/icon/logo.svg";
import MenuIcon from "@/icon/menu.svg";
import useMobileNavStore from "@/store/mobileNav";
import { triggerAnimation } from "@/utils/styles";
import BackButton from "./backButton";
import ThemeButton from "./ThemeButton/ThemeButton";

export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
  hideNavigation?: boolean;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({
  headerType,
  children,
  hideNavigation = false,
}: HeaderProps) => {
  const { isOpen: isMoNavOpen, setIsOpen: setIsMoNavOpen } =
    useMobileNavStore();
  const router = useRouter();

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
    <header className="w-full pt-[clamp(28px,7vw,48px)]">
      <div className="mx-auto flex w-full max-w-[680px] items-center px-5">
        {headerType === "DEFAULT" && (
          <button
            type="button"
            className={classNames("z-10 flex items-center gap-2", {
              "opacity-0 transition-opacity": isMoNavOpen,
            })}
            onClick={handleLogoButton}
          >
            <Logo
              width={90}
              height={30}
              className="text-primary transition-colors hover:text-primary-hover mobile:w-[72px]"
            />
          </button>
        )}
        {headerType === "BACK" && <BackButton />}
        {children && <>{children}</>}
        {!hideNavigation && (
          <>
            <div className="ml-auto flex items-center gap-4">
              <Navigation className="mobile:hidden" />
              <ThemeButton />

              <button
                type="button"
                className="relative z-50 flex h-8 w-8 items-center justify-center rounded-sm transition-opacity hover:opacity-[.55] tablet:hidden"
                onClick={toggleMoMenu}
              >
                <MenuIcon title="menu" style={{ width: 22, height: 22 }} />
              </button>
            </div>
            <MobileNavigation
              isOpen={isMoNavOpen}
              toggleMoMenu={toggleMoMenu}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
