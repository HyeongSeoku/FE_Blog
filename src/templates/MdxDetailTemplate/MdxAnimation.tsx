"use client";
import {
  ANIMATE_FADE_IN_UP,
  MARKUP_ANIMATE,
} from "@/constants/animation.constants";
import { useEffect } from "react";

export default function MdxAnimation() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      `.${MARKUP_ANIMATE}`,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(ANIMATE_FADE_IN_UP);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
