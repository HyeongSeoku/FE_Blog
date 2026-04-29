"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useRef } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxDeg?: number;
}

export function TiltCard({
  children,
  className = "",
  style,
  maxDeg = 7,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const onEnter = () => {
    const card = ref.current;
    if (!card) return;
    rectRef.current = card.getBoundingClientRect();
    card.style.transition = "none";
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    const rect = rectRef.current;
    if (!card || !rect) return;
    const rotX = -(((e.clientY - rect.top) / rect.height) * 2 - 1) * maxDeg;
    const rotY = (((e.clientX - rect.left) / rect.width) * 2 - 1) * maxDeg;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
  };

  const onLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transition = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)";
    card.style.transform =
      "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: tilt effect is purely decorative
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
