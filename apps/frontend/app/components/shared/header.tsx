import { useNavigate } from "@remix-run/react";
import backIconSrc from "../../../image/back_icon.svg";
import { ReactNode } from "react";
import BackButton from "./backButton";
export interface HeaderProps {
  headerType: string;
  children?: ReactNode;
}

const Header = ({ headerType, children }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoButton = () => {
    navigate("/");
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  return (
    <header className="flex pb-2 w-full">
      {headerType !== "BACK" && (
        <button onClick={handleLogoButton}>LOGO</button>
      )}
      {headerType === "BACK" && <BackButton />}
      {children && <>{children}</>}
    </header>
  );
};

export default Header;
