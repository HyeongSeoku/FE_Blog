import { useEffect } from "react";

export default function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean,
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const focusableSelectors = [
      "a[href]",
      "area[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      '[tabindex]:not([tabindex="-1"])',
      "[contenteditable]",
    ];

    const getFocusableElements = () => {
      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
      ).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, isActive]);
}
