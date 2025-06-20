import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const metaTitle = `${BASE_META_TITLE} | 시리즈`;
  const metaDescription = `${BASE_META_TITLE}의 시리즈 페이지입니다`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${BASE_URL}/series`,
      type: "website",
      images: [],
    },
    alternates: {
      canonical: `${BASE_URL}/series`,
    },
  };
}

export function SeriesPage() {
  return <div>series</div>;
}
