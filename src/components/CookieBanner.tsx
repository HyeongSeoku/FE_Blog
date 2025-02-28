"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  COOKIE_GA_CONSENT,
  COOKIE_GA_DIS_AGREE,
} from "@/constants/storage.constant";
import BottomFormSheet from "./BottomFormSheet";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";

const GA = dynamic(() => import("@/components/GA"), { ssr: false });

export default function CookieBanner() {
  const isAlreadyConsent = getCookie(COOKIE_GA_CONSENT) === "true";
  const isGaDisAgree = getCookie(COOKIE_GA_DIS_AGREE) === "false";
  const [isConsentGiven, setIsConsentGiven] = useState(isAlreadyConsent);
  const [isOpen, setIsOpen] = useState(!isAlreadyConsent);

  const handleAccept = () => {
    setCookie(COOKIE_GA_CONSENT, "true", 365);
    removeCookie(COOKIE_GA_DIS_AGREE);

    localStorage.removeItem(COOKIE_GA_DIS_AGREE);
    setIsConsentGiven(true);
    setIsOpen(false);
    window.location.reload();
  };

  const handleDecline = () => {
    setCookie(COOKIE_GA_CONSENT, "false", 365);
    setCookie(COOKIE_GA_DIS_AGREE, "false", 7);

    setIsOpen(false);
    setIsConsentGiven(true);
  };

  if (isGaDisAgree) return;
  if (isConsentGiven) return <GA />;

  return (
    <BottomFormSheet
      title="GA 수집 동의"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      confirmText="동의"
      cancelText="거부"
      onConfirm={handleAccept}
      onCancel={handleDecline}
      hasCloseBtn={false}
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
