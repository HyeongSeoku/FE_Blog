"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.css";
import classNames from "classnames";
import useScrollDisable from "@/hooks/useScrollDisable";
import CloseIcon from "@/icon/close_icon.svg";

export interface BottomSheetProps {
  title: string;
  children: ReactNode;
  hasCloseBtn?: boolean;
  isOpen: boolean;
  bottomChildren?: ReactNode;
  onClose?: () => void;
  modalClassName?: string;
  backDropClassName?: string;
  hasBackDropClose?: boolean;
}

const BottomSheet = ({
  title,
  children,
  hasCloseBtn = false,
  isOpen,
  bottomChildren,
  modalClassName = "",
  backDropClassName = "",
  hasBackDropClose = false,
  onClose,
}: BottomSheetProps) => {
  useScrollDisable(isOpen);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsRendered(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose?.();
  };

  if (!isRendered) return null;

  return (
    <div
      className={classNames(
        "fixed inset-0 z-30 overflow-hidden transition-opacity bg-gray-500 bg-opacity-20 will-change-[opacity]",
        { "opacity-0 pointer-events-none": !isAnimating },
        { "opacity-100": isAnimating },
        backDropClassName,
      )}
      onClick={hasBackDropClose ? handleClose : () => {}}
      aria-hidden="true"
    >
      <div
        className={classNames(
          "absolute max-w-3xl shadow-2xl left-0 right-0 rounded-t-lg py-7 bg-white text-black transition-[bottom] duration-300",
          "tablet:rounded-b-lg tablet:left-1/2 tablet:-translate-x-1/2",
          { "-bottom-full": !isAnimating },
          {
            "bottom-0 tablet:bottom-5": isAnimating,
          },
          modalClassName,
        )}
      >
        <header className="flex items-center px-5 mb-1">
          <h3 className="text-lg font-bold">{title}</h3>
          {!hasCloseBtn && (
            <button onClick={handleClose} className="ml-auto">
              <CloseIcon />
            </button>
          )}
        </header>

        <div
          className={`${styles.contentWrapper} min-h-20 max-h-40 overflow-y-auto scroll px-5 py-5`}
        >
          {children}
        </div>
        {bottomChildren}
      </div>
    </div>
  );
};

export default BottomSheet;
