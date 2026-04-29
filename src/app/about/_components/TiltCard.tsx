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

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = -((y - cy) / cy) * maxDeg;
    const rotY = ((x - cx) / cx) * maxDeg;
    card.style.transition = "transform 0.08s ease-out";
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
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
