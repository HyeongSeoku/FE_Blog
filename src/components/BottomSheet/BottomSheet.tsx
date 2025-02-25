"use client";

import { ReactNode } from "react";
import styles from "./index.module.css";
import classNames from "classnames";
import useScrollDisable from "@/hooks/useScrollDisable";

export interface BottomSheetProps {
  title: string;
  children: ReactNode;
  hasCloseBtn?: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

const BottomSheet = ({
  title,
  children,
  hasCloseBtn = false,
  isOpen,
  onClose,
}: BottomSheetProps) => {
  useScrollDisable(isOpen);

  const handelClose = () => {
    onClose?.();
  };

  return (
    <div
      className={classNames(
        "fixed inset-0 z-30 overflow-hidden transition-[backdrop-filter]",
        { "backdrop-blur-[1px]": isOpen },
        { "backdrop-blur-none": !isOpen },
      )}
    >
      <div
        className={classNames(
          "absolute max-w-3xl shadow-md left-0 right-0 rounded-lg rounded-b-none py-7 bg-white text-black transition-[bottom] duration-300",
          "min-md:rounded-b-lg min-md:left-1/2 min-md:-translate-x-1/2",
          { "-bottom-full": !isOpen },
          {
            "bottom-0 min-md:bottom-5": isOpen,
          },
        )}
      >
        <header className="flex items-center px-5 mb-1">
          <h3 className="text-lg">{title}</h3>
          {!hasCloseBtn && (
            <button onClick={handelClose} className="ml-auto">
              X
            </button>
          )}
        </header>

        <div
          className={`${styles.contentWrapper} min-h-20 max-h-40 overflow-y-auto scroll px-5 py-2`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
