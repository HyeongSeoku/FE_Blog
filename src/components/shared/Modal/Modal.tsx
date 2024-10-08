"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import CloseIcon from "@/icon/close_icon.svg";
import { hexToRgba } from "@/utils/colors";

export interface ModalProps {
  title?: string;
  hasCloseBtn?: boolean;
  children: ReactNode;
  bgColor?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  closeOnDimmedClick?: boolean;
}

const Modal = ({
  title = "",
  hasCloseBtn,
  children,
  bgColor = "",
  isOpen,
  setIsOpen,
  closeOnDimmedClick = true,
}: ModalProps) => {
  const backgroundColor = bgColor ? hexToRgba(bgColor, 40) : undefined;

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDimmedClick = (e: React.MouseEvent) => {
    if (closeOnDimmedClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      <div
        className="relative top-0 left-0 right-0 bottom-0 bg-slate-400 dimmed"
        onClick={handleDimmedClick}
      ></div>
      <div
        role="dialog"
        className="contents bg-white"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <header>
          {title && <h3>{title}</h3>}
          {hasCloseBtn && (
            <button type="button" className="ml-auto" onClick={closeModal}>
              <CloseIcon />
            </button>
          )}
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
