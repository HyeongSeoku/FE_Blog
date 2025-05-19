import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import ClientProvider from "@/components/ClientProvider";
import { pretendard } from "@/styles/font";
import ThemeScript from "@/components/ThemeScript";
import { BASE_META_TITLE } from "@/constants/basic.constants";

const GaBanner = dynamic(() => import("@/components/GaBanner"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: BASE_META_TITLE,
  description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={pretendard.className} suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://seok.dev/" />
        <ThemeScript />
      </head>
      <body>
        <ClientProvider>
          <GaBanner />
          {children}
          <div id="modal-root"></div>
        </ClientProvider>
      </body>
    </html>
  );
}
