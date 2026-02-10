import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import ClientProvider from "@/components/ClientProvider";
import { pretendard } from "@/styles/font";
import ThemeScript from "@/components/ThemeScript";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";

const GA = dynamic(() => import("@/components/GA"), {
  ssr: false,
});
const MicrosoftClarity = dynamic(
  () => import("@/components/MicrosoftClarity"),
  {
    ssr: false,
  },
);

export const metadata: Metadata = {
  title: BASE_META_TITLE,
  description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: BASE_META_TITLE,
    description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
    url: "/",
    siteName: "김형석 블로그",
    images: [
      {
        url: "/image/og_image.png",
        width: 1200,
        height: 630,
        alt: "김형석 블로그 OG 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BASE_META_TITLE,
    description: "프론트엔드 개발자 김형석의 개발 블로그 입니다.",
    images: ["/image/og_image.png"],
    creator: "@HyeongSeoku",
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": [{ url: "feed.xml", title: "RSS Feed" }],
    },
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ClientProvider>{children}</ClientProvider>
        <GA />
        <MicrosoftClarity />
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
