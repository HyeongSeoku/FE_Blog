import { useEffect } from "react";

export function useHashScroll(delay = 100) {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.getElementById(hash.replace("#", ""));
    if (!target) return;
    window.scrollTo(0, 0);
    const timer = setTimeout(
      () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
      delay,
    );
    return () => clearTimeout(timer);
  }, [delay]);
}
