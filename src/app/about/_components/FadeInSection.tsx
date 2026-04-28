"use client";

import type { CSSProperties, ReactNode } from "react";
import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export function FadeInSection({
  children,
  className = "",
  style,
  delay,
}: Props) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>(
    0.08,
    "0px 0px -40px 0px",
  );

  return (
    <div
      ref={ref}
      className={`ab-fade${isIntersecting ? " visible" : ""} ${className}`}
      style={{
        ...style,
        transitionDelay: delay !== undefined ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}
