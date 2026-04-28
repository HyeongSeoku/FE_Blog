import type { Metadata } from "next";
import {
  BASE_URL,
  EMAIL_ADDRESS,
  LINKED_IN_URL,
  MY_GITHUB_URL,
} from "@/constants/basic.constants";
import AboutPageClient from "./AboutPageClient";
import { getCareerYears } from "./utils";

const careerYears = getCareerYears();

const TITLE = "About | 김형석 - Frontend Developer";
const DESCRIPTION = `${careerYears}년차 프론트엔드 개발자 김형석입니다. React, TypeScript, Next.js 기반의 웹 프론트엔드 개발, 레거시 마이그레이션, 성능 최적화, CI/CD 구축 경험을 보유한 엔지니어입니다. NHN, 잡코리아(알바몬)에서 대규모 서비스를 개발하고 있습니다.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "프론트엔드 개발자",
    "김형석",
    "Frontend Developer",
    "React 개발자",
    "TypeScript",
    "Next.js",
    "웹 개발자",
    "NHN",
    "잡코리아",
    "알바몬",
    "포트폴리오",
    "이력서",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    type: "profile",
    siteName: "SEOK 블로그",
    images: [
      {
        url: "/image/og_image.png",
        width: 1200,
        height: 630,
        alt: "김형석 블로그 OG 이미지",
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "김형석",
    alternateName: "Kim Hyeong Seok",
    jobTitle: "Frontend Developer",
    url: `${BASE_URL}/about`,
    email: EMAIL_ADDRESS,
    sameAs: [MY_GITHUB_URL, LINKED_IN_URL],
    worksFor: {
      "@type": "Organization",
      name: "NHN",
      url: "https://www.nhn.com",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "나사렛대학교",
    },
    knowsAbout: [
      "React",
      "TypeScript",
      "Next.js",
      "JavaScript",
      "Node.js",
      "Frontend Development",
      "Web Performance Optimization",
      "CI/CD",
    ],
    description: DESCRIPTION,
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/about`,
    mainEntity: {
      "@id": `${BASE_URL}/about#person`,
      "@type": "Person",
      name: "김형석",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${BASE_URL}/about`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personSchema, profilePageSchema]),
        }}
      />
      <AboutPageClient />
    </>
  );
}
