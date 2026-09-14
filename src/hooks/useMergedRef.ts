"use client";

import type { Ref } from "react";
import { useCallback } from "react";

/**
 * 여러 ref를 하나의 callback ref로 합치는 훅.
 * forwardRef + 내부 ref를 동시에 사용할 때 유용하다.
 */
export function useMergedRef<T>(
  ...refs: (Ref<T> | undefined)[]
): (node: T | null) => void {
  return useCallback((node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: refs spread as deps
  }, refs);
}
