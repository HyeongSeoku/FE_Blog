import { useEffect } from "react";

const useScrollDisable = (isOpen: boolean) => {
  useEffect(() => {
    const disableScroll = () => {
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.setAttribute("data-modal-open", "true");
    };

    const enableScroll = () => {
      const scrollY = document.body.style.top;
      document.body.removeAttribute("data-modal-open");
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };

    if (isOpen) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => {
      enableScroll();
    };
  }, [isOpen]);
};

export default useScrollDisable;
