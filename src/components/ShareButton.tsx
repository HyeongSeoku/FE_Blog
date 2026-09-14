"use client";

import { useEffect, useRef, useState } from "react";
import LinkIcon from "@/icon/link.svg";

const COPIED_DURATION = 1500;

const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), COPIED_DURATION);
    } catch (error) {
      console.error("링크 복사 실패:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="flex items-center gap-1 text-meta text-muted transition-opacity hover:opacity-[.55]"
    >
      <LinkIcon style={{ width: 14, height: 14 }} />
      {copied ? "링크 복사됨" : "공유"}
    </button>
  );
};

export default ShareButton;
