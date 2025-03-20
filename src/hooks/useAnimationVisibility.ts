import { useEffect, useRef, useState, RefObject } from "react";

const useAnimationVisibility = <T extends HTMLElement>(
  threshold: number = 0.3,
): [boolean, RefObject<T>] => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [isVisible, ref];
};

export default useAnimationVisibility;
