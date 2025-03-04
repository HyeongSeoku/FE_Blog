"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
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
}

const BottomSheet = ({
  title,
  children,
  hasCloseBtn = false,
  isOpen,
  bottomChildren,
  modalClassName = "",
  backDropClassName = "",
  onClose,
}: BottomSheetProps) => {
  useScrollDisable(isOpen);

  const handelClose = () => {
    onClose?.();
  };

  return (
    <div
      className={classNames(
        "fixed inset-0 z-30 overflow-hidden transition-[backdrop-filter] bg-gray-500 bg-opacity-20",
        { "backdrop-blur-[1px]": isOpen },
        { "backdrop-blur-none hidden": !isOpen },
        backDropClassName,
      )}
    >
      <div
        className={classNames(
          "absolute max-w-3xl shadow-2xl left-0 right-0 rounded-t-lg py-7 bg-white text-black transition-[bottom] duration-300",
          "min-md:rounded-b-lg min-md:left-1/2 min-md:-translate-x-1/2",
          { "-bottom-full": !isOpen },
          {
            "bottom-0 min-md:bottom-5": isOpen,
          },
          modalClassName,
        )}
      >
        <header className="flex items-center px-5 mb-1">
          <h3 className="text-lg font-bold">{title}</h3>
          {!hasCloseBtn && (
            <button onClick={handelClose} className="ml-auto">
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
