import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down";

const useScrollDirection = (threshold = 50): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isWithinScrollThreshold =
        Math.abs(currentScrollY - lastScrollY) < threshold;

      if (isWithinScrollThreshold) {
        return;
      }

      const isScrollDown =
        currentScrollY > lastScrollY && currentScrollY > threshold;

      setScrollDirection(isScrollDown ? "down" : "up");
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, threshold]);

  return scrollDirection;
};

export default useScrollDirection;
