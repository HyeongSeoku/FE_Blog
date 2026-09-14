"use client";

import { useCallback, useRef, useState } from "react";

type SetStateAction<T> = T | ((prev: T) => T);

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Manages controlled / uncontrolled state with a single API.
 *
 * When `value` is provided (controlled), internal state is bypassed and every
 * update flows through `onChange`. When `value` is `undefined` (uncontrolled),
 * internal state is used and `onChange` is called as a side-effect.
 */
export function useControllableState<T>({
  value: controlled,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: SetStateAction<T>) => void] {
  const isControlled = controlled !== undefined;
  const isControlledRef = useRef(isControlled);
  isControlledRef.current = isControlled;

  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? controlled : internal;
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const nextValue =
        typeof next === "function"
          ? (next as (prev: T) => T)(currentRef.current)
          : next;

      if (!isControlledRef.current) setInternal(nextValue);
      onChange?.(nextValue);
    },
    [onChange],
  );

  return [current, setValue];
}
