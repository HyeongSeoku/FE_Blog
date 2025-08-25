import { useLayoutEffect, useState } from "react";

const useScrollDisable = (isOpen: boolean) => {
  const [scrollY, setScrollY] = useState<number | null>(null);

  useLayoutEffect(() => {
    const isFirstOpen = isOpen && scrollY === null;

    if (isFirstOpen) {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      document.body.style.position = "fixed";
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = "100%";
      document.body.setAttribute("data-modal-open", "true");
    }

    if (!isOpen && scrollY !== null) {
      document.body.removeAttribute("data-modal-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        setScrollY(null);
      });
    }

    return () => {
      if (scrollY !== null) {
        document.body.removeAttribute("data-modal-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      }
    };
  }, [isOpen, scrollY]);

  return scrollY;
};

export default useScrollDisable;
