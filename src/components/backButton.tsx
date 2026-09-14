"use client";

import { Button } from "@seoku/design-system";
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
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`!h-auto !w-3 !p-0 ${customClassName}`}
      onClick={handleBackButton}
    >
      <BackIcon />
    </Button>
  );
};

export default BackButton;
