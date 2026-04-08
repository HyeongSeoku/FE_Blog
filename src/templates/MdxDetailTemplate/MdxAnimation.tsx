"use client";
import { useEffect } from "react";
import {
  ANIMATE_FADE_IN_UP,
  MARKUP_ANIMATE,
} from "@/constants/animation.constants";

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

    // biome-ignore lint/suspicious/useIterableCallbackReturn: observe returns void
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
