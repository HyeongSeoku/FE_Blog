"use client";

import { useEffect, useRef, useState } from "react";

export function CursorSpotlight() {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blobPos = useRef({ cx: -999, cy: -999, tx: -999, ty: -999 });
  const ringPos = useRef({ cx: -999, cy: -999, tx: -999, ty: -999 });
  const [visible, setVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window && navigator.maxTouchPoints > 0) return;

    // Detect theme
    const update = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleMouseMove = (e: MouseEvent) => {
      blobPos.current.tx = e.clientX;
      blobPos.current.ty = e.clientY;
      ringPos.current.tx = e.clientX;
      ringPos.current.ty = e.clientY;

      if (blobPos.current.cx === -999) {
        blobPos.current.cx = e.clientX;
        blobPos.current.cy = e.clientY;
        ringPos.current.cx = e.clientX;
        ringPos.current.cy = e.clientY;
      }
      setVisible(true);
    };

    let raf: number;
    const animate = () => {
      // Blob: slow, dreamy lag
      blobPos.current.cx += (blobPos.current.tx - blobPos.current.cx) * 0.065;
      blobPos.current.cy += (blobPos.current.ty - blobPos.current.cy) * 0.065;

      // Ring: faster, snappier
      ringPos.current.cx += (ringPos.current.tx - ringPos.current.cx) * 0.18;
      ringPos.current.cy += (ringPos.current.ty - ringPos.current.cy) * 0.18;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${blobPos.current.cx - 300}px, ${blobPos.current.cy - 300}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.cx - 20}px, ${ringPos.current.cy - 20}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blobOpacity = isDark ? 0.08 : 0.16;

  return (
    <>
      {/* Soft glow blob */}
      <div
        ref={blobRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(10,186,181,1) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          filter: "blur(60px)",
          opacity: visible ? blobOpacity : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1.5px solid rgba(10,186,181,0.55)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </>
  );
}
