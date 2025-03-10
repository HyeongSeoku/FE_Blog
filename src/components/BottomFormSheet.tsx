"use client";

import { useCallback } from "react";
import BottomSheet, { BottomSheetProps } from "./BottomSheet/BottomSheet";

export interface BottomFormSheetProps extends BottomSheetProps {
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function BottomFormSheet({
  title,
  children,
  hasCloseBtn = true,
  isOpen,
  confirmText = "확인",
  cancelText = "취소",
  onClose,
  onConfirm,
  onCancel,
}: BottomFormSheetProps) {
  const handleConfirm = useCallback(() => {
    onClose?.();
    onConfirm?.();
  }, [onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onClose?.();
    onCancel?.();
  }, [onCancel, onClose]);

  return (
    <BottomSheet
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      hasCloseBtn={hasCloseBtn}
      modalClassName="pt-7 py-3"
      bottomChildren={
        <div className="flex gap-2 px-5 py-1 leading-8">
          <button
            className="rounded-md flex-1 bg-primary hover:bg-primary-hover transition-colors duration-300"
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
          <button
            className="rounded-md flex-1 bg-gray-400 hover:bg-gray-200  transition-colors duration-300"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
        </div>
      }
    >
      {children}
    </BottomSheet>
  );
}
