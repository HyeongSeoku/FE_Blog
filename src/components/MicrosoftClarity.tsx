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

    // Clarity 로드 후 마스킹 설정 (엄격함 모드)
    script.onload = () => {
      if (window.clarity) {
        // 모든 텍스트와 입력값 마스킹
        window.clarity("set", "mask", "strict");

        // 민감한 요소 자동 마스킹
        window.clarity("set", "maskSensitiveElements", true);
      }
    };
  }, []);

  return null;
}

export default MicrosoftClarity;
