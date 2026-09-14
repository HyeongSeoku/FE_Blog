"use client";

import { type RefObject, useEffect } from "react";

/**
 * useClickOutside - 지정된 ref 외부를 클릭하면 콜백을 실행하는 훅
 * @param ref 대상 DOM 요소의 참조
 * @param callback 외부 클릭 시 실행될 콜백 함수
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
