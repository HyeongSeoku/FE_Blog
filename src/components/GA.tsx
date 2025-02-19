"use client";

import { COOKIE_CONSENT } from "@/constants/localStorage.constant";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function GA() {
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT);
    if (consent === "true") {
      setIsConsentGiven(true);
    }
  }, []);

  if (!isConsentGiven) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `,
        }}
      />
    </>
  );
}
