import { useEffect, useState } from "react";

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressValue = (scrollTop / windowHeight) * 100;
      setProgress(progressValue || 0);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    // 초기 상태 업데이트
    handleScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
};

export default useScrollProgress;
