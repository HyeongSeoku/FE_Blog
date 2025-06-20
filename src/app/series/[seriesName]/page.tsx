import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { seriesName: string };
}): Metadata {
  const { seriesName } = params;
  const metaTitle = `${BASE_META_TITLE} | 시리즈 ${seriesName}`;
  const metaDescription = `${BASE_META_TITLE}의 시리즈 : ${seriesName} 페이지입니다`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${BASE_URL}/series/${seriesName}`,
      type: "website",
      images: [],
    },
    alternates: {
      canonical: `${BASE_URL}/series/${seriesName}`,
    },
  };
}

export default function SeriesDetailPage({
  params,
}: {
  params: { seriesName: string };
}) {
  const { seriesName } = params;
  return <div>{seriesName}</div>;
}
