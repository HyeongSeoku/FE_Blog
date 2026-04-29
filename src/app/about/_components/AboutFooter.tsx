"use client";

import { useEffect, useRef, useState } from "react";
import {
  EMAIL_ADDRESS,
  LINKED_IN_URL,
  MY_GITHUB_URL,
} from "@/constants/basic.constants";
import { ExternalIcon } from "./icons";

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function AboutFooter() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    }
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div
        className="max-w-[860px] mx-auto"
        style={{ padding: "2.5rem clamp(1.5rem, 5vw, 4rem)" }}
      >
        {/* Education + Contact grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10 tablet:gap-16 mb-8">
          {/* Education */}
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Education
            </p>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              나사렛대학교
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              IT학부 · 2016.03 ~ 2022.02
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Contact
            </p>
            <div className="flex flex-col gap-2.5">
              {/* Email with copy */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group text-sm text-gray-700 dark:text-gray-300 hover:text-primary inline-flex items-center gap-2 transition-colors w-fit"
              >
                <span>{EMAIL_ADDRESS}</span>
                <span
                  className="transition-all duration-200"
                  style={{
                    color: copied ? "var(--primary-color)" : undefined,
                    transform: copied ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>

              {/* Copied feedback */}
              <span
                className="text-xs text-primary"
                style={{
                  height: "1rem",
                  opacity: copied ? 1 : 0,
                  transform: copied ? "translateY(0)" : "translateY(-4px)",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
              >
                클립보드에 복사됐습니다 ✓
              </span>

              <a
                href={MY_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
              >
                GitHub
                <ExternalIcon />
              </a>
              <a
                href={LINKED_IN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary inline-flex items-center gap-1.5 transition-colors"
              >
                LinkedIn
                <ExternalIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          © 2025 Seok. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
