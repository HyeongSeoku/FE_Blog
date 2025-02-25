"use client";

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
  hasCloseBtn,
  isOpen,
  onClose,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: BottomFormSheetProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <BottomSheet title={title} isOpen={isOpen}>
      {children}
      <div className="absolute bottom-0 flex gap-2">
        <button className="rounded-md flex-1" onClick={handleConfirm}>
          {confirmText}
        </button>
        <button className="rounded-md flex-1" onClick={handleCancel}>
          {cancelText}
        </button>
      </div>
    </BottomSheet>
  );
}
