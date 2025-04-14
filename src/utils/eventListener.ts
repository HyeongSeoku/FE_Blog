import { KeyboardEvent } from "react";

export function handleKeyboardClick(
  e: KeyboardEvent<HTMLElement>,
  callback: () => void,
) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    callback();
  }
}
