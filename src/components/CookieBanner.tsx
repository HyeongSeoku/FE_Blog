"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { COOKIE_CONSENT } from "@/constants/localStorage.constant";
import BottomFormSheet from "./BottomFormSheet";

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
    <BottomFormSheet
      title="GA 수집 동의"
      isOpen={isOpen}
      confirmText="동의"
      cancelText="거부"
      onConfirm={handleAccept}
      onCancel={handleDecline}
    >
      <div className="h-96">
        <p>
          이 웹사이트는 Google Analytics를 사용하여 방문자의 웹사이트 이용
          방식을 분석하고, 사용자 경험을 개선하기 위해 쿠키를 사용합니다. Google
          Analytics를 통해 수집된 데이터는 익명으로 처리되며, 개인 식별 정보는
          저장되지 않습니다.
        </p>
      </div>
    </BottomFormSheet>
  );
}
