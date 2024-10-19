import { useState, useEffect } from "react";

function useModalVisibility(show: boolean, animationDuration = 300) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (show) {
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [show, animationDuration]);

  return { isVisible, isAnimating };
}

export default useModalVisibility;
