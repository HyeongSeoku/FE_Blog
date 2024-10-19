"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import ReactDOM from "react-dom";
import CloseIcon from "@/icon/close_icon.svg";
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
  closeOnDimmedClick?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({
  title = "",
  hasCloseBtn,
  children,
  bgColor = "",
  isOpen,
  closeOnDimmedClick = true,
  setIsOpen,
}: ModalProps) => {
  const modalElement = document.getElementById("modal-root");
  const backgroundColor = bgColor ? hexToRgba(bgColor, 40) : undefined;

  useScrollDisable(isOpen);

  // useModalVisibility에서 가시성과 애니메이션 상태 가져오기
  const { isVisible, isAnimating } = useModalVisibility(isOpen, 300);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDimmedClick = (e: React.MouseEvent) => {
    if (closeOnDimmedClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!modalElement || !isVisible) return null; // 가시성에 따라 렌더링 제어

  return ReactDOM.createPortal(
    <div
      className={classNames(
        "fixed inset-0 flex items-center justify-center z-40 bg-slate-400 transform transition-all duration-300",
        { "opacity-0": !isAnimating, "opacity-100": isAnimating },
      )}
      onClick={handleDimmedClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        role="dialog"
        className={classNames(
          "relative min-w-64 bg-white p-6 rounded-lg shadow-lg z-50 max-w-screen-sm transform transition-all duration-300 text-[var(--light-text-color)]",
          {
            "scale-95": !isAnimating, // 열릴 때 애니메이션
            "scale-100": isAnimating, // 닫힐 때 애니메이션
          },
        )}
        style={{
          backgroundColor: backgroundColor,
          opacity: isAnimating ? 1 : 0, // 애니메이션에 따라 투명도 제어
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center">
          {title && <h3 className="font-semibold text-2xl">{title}</h3>}
          {hasCloseBtn && (
            <button
              type="button"
              aria-label="close"
              className="ml-auto"
              onClick={closeModal}
            >
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
