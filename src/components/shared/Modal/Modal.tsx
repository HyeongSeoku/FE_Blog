"use client";

import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import CloseIcon from "@/icon/close_icon.svg";
import ReactDOM from "react-dom";
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
  const modalElement = document.getElementById("modal-root");
  const backgroundColor = bgColor ? hexToRgba(bgColor, 40) : undefined;

  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }

    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDimmedClick = (e: React.MouseEvent) => {
    if (closeOnDimmedClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!modalElement) {
    console.error("Modal root element not found.");
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-40 bg-slate-400"
      onClick={handleDimmedClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        role="dialog"
        className="relative min-w-64 bg-white p-6 rounded-lg shadow-lg z-50 max-w-screen-sm opacity-100"
        style={{
          backgroundColor: backgroundColor,
        }}
        onClick={(e) => e.stopPropagation()}
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
    </div>,
    modalElement,
  );
};

export default Modal;
