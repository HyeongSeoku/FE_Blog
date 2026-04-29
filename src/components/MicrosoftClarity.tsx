"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

function MicrosoftClarity() {
  useEffect(() => {
    if (typeof window === "undefined" || window.clarity) return;

    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!clarityId) return;

    window.clarity = (...args: unknown[]) => {
      const clarity = window.clarity;
      if (clarity) {
        clarity.q = clarity.q ?? [];
        clarity.q.push(args);
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  }, []);

  return null;
}

export default MicrosoftClarity;
