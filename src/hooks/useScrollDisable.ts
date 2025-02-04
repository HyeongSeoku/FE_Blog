import { useLayoutEffect, useState } from "react";

const useScrollDisable = (isOpen: boolean) => {
  const [scrollY, setScrollY] = useState<number | null>(null);

  useLayoutEffect(() => {
    const isFirstOpen = isOpen && scrollY === null;

    if (isFirstOpen) {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      document.body.style.top = `-${currentScrollY}px`;
      document.body.setAttribute("data-modal-open", "true");
    }

    if (!isOpen && scrollY !== null) {
      // 모달이 닫힐 때 스크롤 복원
      document.body.removeAttribute("data-modal-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
      setScrollY(null);
    }

    return () => {
      if (scrollY !== null) {
        document.body.removeAttribute("data-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      }
    };
  }, [isOpen, scrollY]);

  return scrollY;
};

export default useScrollDisable;
