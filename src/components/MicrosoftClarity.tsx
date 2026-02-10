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
    if (typeof window === "undefined") return;

    // Clarity 스크립트가 이미 로드되었는지 확인
    if (window.clarity) return;

    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!clarityId) return;

    // Clarity 초기화 함수
    window.clarity = function (...args: unknown[]) {
      const clarity = window.clarity;
      if (clarity) {
        (clarity.q = clarity.q || []).push(args);
      }
    };

    // Clarity 스크립트 로드
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  }, []);

  return null;
}

export default MicrosoftClarity;
