import { useNavigate } from "@remix-run/react";
import { ReactNode } from "react";
import BackButton from "./backButton";
import HamburgerButton from "./HamburgerButton";
export interface HeaderProps {
  headerType: HeaderType;
  children?: ReactNode;
}

export type HeaderType = "DEFAULT" | "BACK" | "NONE";

const Header = ({ headerType, children }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoButton = () => {
    navigate("/");
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
