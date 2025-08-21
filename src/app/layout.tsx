import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import ClientProvider from "@/components/ClientProvider";
import { pretendard } from "@/styles/font";
import ThemeScript from "@/components/ThemeScript";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";

const GaBanner = dynamic(() => import("@/components/GaBanner"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: BASE_META_TITLE,
  description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
  openGraph: {
    title: BASE_META_TITLE,
    description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
    url: BASE_URL,
    siteName: "김형석 블로그",
    images: [
      {
        url: `${BASE_URL}/image/og_image.svg`,
        width: 1200,
        height: 630,
        alt: "김형석 블로그 OG 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={pretendard.variable} suppressHydrationWarning>
      <head>
        <link rel="canonical" href={BASE_URL} />
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
