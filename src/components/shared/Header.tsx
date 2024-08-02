"use client";

import { ReactNode } from "react";
import BackButton from "./backButton";
import HamburgerButton from "./HamburgerButton";
import { useRouter } from "next/navigation";
export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({ headerType, children }: HeaderProps) => {
  const router = useRouter();

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

      <HamburgerButton />
    </header>
  );
};

export default Header;
