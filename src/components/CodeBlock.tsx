"use client";

import classNames from "classnames";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

interface CodeBlockProps {
  children: ReactNode;
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

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const CodeBlock = ({
  children,
  hasCopyBtn = true,
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
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
    <code className={classNames("group relative", className)}>
      {children}
      {hasCopyBtn && (
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={copied ? "복사됨" : "코드 복사"}
          title={copied ? "복사됨" : "코드 복사"}
          className={classNames(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/10 text-[#e1e4e8] opacity-0 backdrop-blur-sm transition-all duration-150 hover:bg-white/20 group-hover:opacity-100",
            copied &&
              "!opacity-100 !border-emerald-400/30 !bg-emerald-500/20 text-emerald-400",
          )}
        >
          <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span
              className={classNames(
                "absolute transition-all duration-150",
                copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
              )}
            >
              <CopyIcon />
            </span>
            <span
              className={classNames(
                "absolute transition-all duration-150",
                copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            >
              <CheckIcon />
            </span>
          </span>
        </button>
      )}
    </code>
  );
};

export default CodeBlock;
