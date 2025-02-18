"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const GA = dynamic(() => import("@/components/GA"), { ssr: false });

export default function CookieBanner() {
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "true") {
      setIsConsentGiven(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsConsentGiven(true);
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "false");
    setIsConsentGiven(true);
  };

  if (isConsentGiven) return <GA />;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#000",
        color: "#fff",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <p>이 웹사이트는 사용자 경험을 개선하기 위해 쿠키를 사용합니다.</p>
      <button onClick={handleAccept} style={{ marginRight: "10px" }}>
        동의
      </button>
      <button onClick={handleDecline}>거부</button>
    </div>
  );
}
