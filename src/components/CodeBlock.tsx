"use client";

import classNames from "classnames";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ANIMATE_FADE_IN_UP } from "@/constants/animation.constants";
import useAnimationVisibility from "@/hooks/useAnimationVisibility";
import type { AnimationNameType } from "./AnimationContainer";

interface CodeBlockProps {
  children: ReactNode;
  hasAnimation?: boolean;
  animationName?: AnimationNameType;
  hasCopyBtn?: boolean;
  className?: string;
}

const extractTextFromChildren = (node: ReactNode): string => {
  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromChildren).join("");
  }

  if (typeof node === "object" && node && "props" in node) {
    const { children } = node.props as { children: ReactNode };
    return extractTextFromChildren(children);
  }

  return "";
};

const CodeBlock = ({
  children,
  hasAnimation = true,
  animationName = undefined,
  hasCopyBtn = true,
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, ref] = useAnimationVisibility();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const codeText = useMemo(() => extractTextFromChildren(children), [children]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  return (
    <code
      className={classNames(
        "relative group",
        {
          "opacity-0 transition duration-300 will-change-transform":
            hasAnimation,
          [animationName || ANIMATE_FADE_IN_UP]: hasAnimation && isVisible,
        },
        className,
      )}
      ref={ref}
    >
      {children}
      {hasCopyBtn && (
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={classNames(
            "absolute top-2 right-2 p-1 bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 flex items-center justify-center w-16 h-8 transition-[opacity colors] duration-200 border border-transparent",
            { "border-green-500 text-green-500": copied },
          )}
        >
          <span
            className={`transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"} absolute`}
          >
            Copied
          </span>
          <span
            className={`transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"} absolute`}
          >
            Copy
          </span>
        </button>
      )}
    </code>
  );
};

export default CodeBlock;
