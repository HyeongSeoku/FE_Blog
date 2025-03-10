import { useState, useEffect, useCallback } from "react";

const useScrollPosition = () => {
  const [scrollState, setScrollState] = useState({
    isScrollTop: true,
    isScrollBottom: false,
  });

  const handleScroll = useCallback(() => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;

    setScrollState({
      isScrollTop: scrollY === 0,
      isScrollBottom: scrollY + innerHeight >= scrollHeight,
    });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return scrollState;
};

export default useScrollPosition;
