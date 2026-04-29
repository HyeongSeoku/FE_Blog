"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({
    blobCx: -999,
    blobCy: -999,
    blobTx: -999,
    blobTy: -999,
    ringCx: -999,
    ringCy: -999,
    ringTx: -999,
    ringTy: -999,
  });
  const rafRef = useRef<number | null>(null);
  const isDarkRef = useRef(false);

  useEffect(() => {
    if ("ontouchstart" in window && navigator.maxTouchPoints > 0) return;

    const blob = blobRef.current;
    const ring = ringRef.current;
    if (!blob || !ring) return;

    // Theme — direct DOM, no re-render
    const syncTheme = () => {
      isDarkRef.current =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (blob.style.opacity !== "0") {
        blob.style.opacity = String(isDarkRef.current ? 0.08 : 0.16);
      }
    };
    syncTheme();
    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const animate = () => {
      const p = pos.current;
      p.blobCx += (p.blobTx - p.blobCx) * 0.065;
      p.blobCy += (p.blobTy - p.blobCy) * 0.065;
      p.ringCx += (p.ringTx - p.ringCx) * 0.18;
      p.ringCy += (p.ringTy - p.ringCy) * 0.18;

      blob.style.transform = `translate(${p.blobCx - 200}px, ${p.blobCy - 200}px)`;
      ring.style.transform = `translate(${p.ringCx - 20}px, ${p.ringCy - 20}px)`;

      const converged =
        Math.hypot(p.blobTx - p.blobCx, p.blobTy - p.blobCy) < 0.3 &&
        Math.hypot(p.ringTx - p.ringCx, p.ringTy - p.ringCy) < 0.3;

      if (converged) {
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      const p = pos.current;

      if (p.blobTx === -999) {
        p.blobCx = p.blobTx = e.clientX;
        p.blobCy = p.blobTy = e.clientY;
        p.ringCx = p.ringTx = e.clientX;
        p.ringCy = p.ringTy = e.clientY;
        blob.style.opacity = String(isDarkRef.current ? 0.08 : 0.16);
        ring.style.opacity = "1";
      } else {
        p.blobTx = e.clientX;
        p.blobTy = e.clientY;
        p.ringTx = e.clientX;
        p.ringTy = e.clientY;
      }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      {/* Soft glow blob — 400×400, blur 40px (was 600×600 blur 60px) */}
      <div
        ref={blobRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(10,186,181,1) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          filter: "blur(40px)",
          opacity: 0,
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
          opacity: 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </>
  );
}
