"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import CloseIcon from "@/icon/close_icon.svg";
import ReactDOM from "react-dom";
import { hexToRgba } from "@/utils/colors";
import useScrollDisable from "@/hooks/useScrollDisable";
import useModalVisibility from "@/hooks/useModalVisiblilty";
import classNames from "classnames";

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

  const isVisible = useModalVisibility(isOpen, 300);
  // TODO: 모달 open 시 스크롤 최상단으로 이동되는 현상
  useScrollDisable(isOpen);

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

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={classNames(
        "fixed inset-0 flex items-center justify-center z-40 bg-slate-400",
        { "opacity-0": !isOpen, "opacity-100": isOpen },
      )}
      onClick={handleDimmedClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        role="dialog"
        className={classNames(
          "relative min-w-64 bg-white p-6 rounded-lg shadow-lg z-50 max-w-screen-sm transform transition-all duration-300",
          {
            "opacity-0 scale-95": !isOpen,
            "opacity-100 scale-100": isOpen,
          },
        )}
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
