"use client";

import { COOKIE_GA_CONSENT } from "@/constants/storage.constant";
import { getCookie, removeCookie } from "@/utils/cookies";
import Script from "next/script";

export default function GA() {
  const isAgreeGA = getCookie(COOKIE_GA_CONSENT) === "true";

  if (!isAgreeGA) {
    removeCookie("_ga");
    removeCookie(`_ga_${process.env.NEXT_PUBLIC_GA_ID}`);
    return null;
  }

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
