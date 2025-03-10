"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import ReactDOM from "react-dom";
import CloseIcon from "@/icon/close_icon.svg";
import { hexToRgba } from "@/utils/styles";
import useScrollDisable from "@/hooks/useScrollDisable";
import useModalVisibility from "@/hooks/useModalVisiblilty";
import classNames from "classnames";
import useModalKeyboardControl from "@/hooks/useModalKeyboardControl";

export interface ModalProps {
  title?: string;
  hasCloseBtn?: boolean;
  children: ReactNode;
  bgColor?: string;
  isOpen: boolean;
  closeOnDimmedClick?: boolean;
  controlWithKeyboard?: boolean;
  modalContainerClassName?: string;
  className?: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
}

const Modal = ({
  title = "",
  hasCloseBtn,
  children,
  bgColor = "",
  isOpen,
  closeOnDimmedClick = true,
  controlWithKeyboard = true,
  modalContainerClassName = "",
  className = "",
  setIsOpen,
  onClose,
}: ModalProps) => {
  const modalElement = document.getElementById("modal-root");
  const backgroundColor = bgColor ? hexToRgba(bgColor, 40) : undefined;

  const closeModal = () => {
    if (onClose) {
      onClose();
      return;
    }
    setIsOpen?.(false);
  };

  useScrollDisable(isOpen);
  useModalKeyboardControl(isOpen, closeModal, controlWithKeyboard);

  const { isVisible, isAnimating } = useModalVisibility(isOpen, 300);

  const handleDimmedClick = (e: React.MouseEvent) => {
    if (closeOnDimmedClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!modalElement || !isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={classNames(
        "fixed inset-0 flex items-center justify-center z-40 bg-slate-400 transform transition-all duration-300",
        { "opacity-0": !isAnimating, "opacity-100": isAnimating },
        modalContainerClassName,
      )}
      onClick={handleDimmedClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        role="dialog"
        className={classNames(
          "relative min-w-64 bg-white p-6 rounded-md shadow-lg z-50 max-w-screen-sm transform transition-all duration-300 text-[var(--light-text-color)]",
          {
            "scale-95": !isAnimating,
            "scale-100": isAnimating,
          },
          className,
        )}
        style={{
          backgroundColor: backgroundColor,
          opacity: isAnimating ? 1 : 0,
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
