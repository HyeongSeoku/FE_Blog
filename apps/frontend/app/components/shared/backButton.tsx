import { useNavigate } from "@remix-run/react";
import backIconSrc from "../../../image/back_icon.svg";

export interface BackButtonProps {
  customClassName?: string;
  onBackClick?: () => void;
}

const BackButton = ({ customClassName = "", onBackClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBackButton = () => {
    if (onBackClick) {
      onBackClick();
    }

    navigate(-1);
  };

  return (
    <button className={`flex w-8 ${customClassName}`}>
      <img className="w-full" src={backIconSrc} />
    </button>
  );
};

export default BackButton;
