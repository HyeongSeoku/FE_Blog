"use client";

import { useRouter } from "next/navigation";
import BackIcon from "@/icon/back_icon.svg";

export interface BackButtonProps {
  customClassName?: string;
  onBackClick?: () => void;
}

const BackButton = ({ customClassName = "", onBackClick }: BackButtonProps) => {
  const router = useRouter();

  const handleBackButton = () => {
    if (onBackClick) {
      onBackClick();
    }

    router.back();
  };

  return (
    <button
      className={`flex w-3 ${customClassName}`}
      onClick={handleBackButton}
    >
      <BackIcon />
    </button>
  );
};

export default BackButton;
