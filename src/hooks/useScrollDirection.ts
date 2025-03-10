import { useState, useEffect, useRef } from "react";

type ScrollDirection = "up" | "down";

const useScrollDirection = (threshold = 50): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isWithinScrollThreshold =
        Math.abs(currentScrollY - lastScrollY.current) < threshold;

      if (isWithinScrollThreshold) {
        return;
      }

      const isScrollDown =
        currentScrollY > lastScrollY.current && currentScrollY > threshold;

      setScrollDirection(isScrollDown ? "down" : "up");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrollDirection;
};

export default useScrollDirection;
