import { useEffect } from "react";

export default function useModalKeyboardControl(
  isOpen: boolean,
  closeModal: () => void,
  controlWithKeyboard: boolean = true,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && controlWithKeyboard) {
        closeModal();
        if (document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }
      }
    };

    if (controlWithKeyboard && isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, controlWithKeyboard, closeModal]);
}
