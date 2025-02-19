import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";

const CookieBanner = dynamic(() => import("@/components/CookieBanner"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "SEOK 개발 블로그",
  description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/theme.js" />
      </head>
      <body>
        <CookieBanner />
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
