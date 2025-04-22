import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import ClientProvider from "@/components/ClientProvider";
import { pretendard } from "@/styles/font";
import ThemeScript from "@/components/ThemeScript";

const GaBanner = dynamic(() => import("@/components/GaBanner"), {
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
    <html lang="en" className={pretendard.className} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/image/default_img.png" />
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
