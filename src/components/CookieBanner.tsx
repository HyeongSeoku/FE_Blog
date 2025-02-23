"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { COOKIE_CONSENT } from "@/constants/localStorage.constant";
import BottomSheet from "./BottomSheet/BottomSheet";

const GA = dynamic(() => import("@/components/GA"), { ssr: false });

export default function CookieBanner() {
  const isAlreadyConsent = localStorage.getItem(COOKIE_CONSENT) === "true";
  const [isConsentGiven, setIsConsentGiven] = useState(isAlreadyConsent);
  const [isOpen, setIsOpen] = useState(!isAlreadyConsent);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT);
    const isConsent = consent === "true";
    setIsConsentGiven(isConsent);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT, "true");
    setIsConsentGiven(true);
    setIsOpen(false);
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT, "false");
    setIsOpen(false);
    setIsConsentGiven(true);
  };

  // if (isConsentGiven) return <GA />;

  return (
    <BottomSheet
      title="임시"
      isOpen={isOpen}
      content={
        <div className="h-96">
          <p>이 웹사이트는 사용자 경험을 개선하기 위해 쿠키를 사용합니다.</p>
          <button onClick={handleAccept} style={{ marginRight: "10px" }}>
            동의
          </button>
          <button onClick={handleDecline}>거부</button>
        </div>
      }
    />
  );
}
