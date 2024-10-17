import { useState, useEffect } from "react";

function useModalVisibility(show: boolean, animationDuration = 300) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [show, animationDuration]);

  return isVisible;
}

export default useModalVisibility;
