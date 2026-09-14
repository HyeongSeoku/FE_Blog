import type { Metadata } from "next";
import SeriesListItem from "@/components/SeriesListItem";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getAllSeriesMetadata } from "@/utils/series";

export function generateMetadata(): Metadata {
  const metaTitle = `${BASE_META_TITLE} | 시리즈`;
  const metaDescription = `${BASE_META_TITLE}의 시리즈 페이지입니다`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "/series",
      type: "website",
      images: [],
    },
    alternates: { canonical: "/series" },
  };
}

async function SeriesPage() {
  const seriesData = await getAllSeriesMetadata({ sortByLatestPost: true });
  const seriesList = Object.entries(seriesData);

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/series`,
    url: `${BASE_URL}/series`,
    name: "시리즈",
    description: "블로그 연재 시리즈 목록입니다.",
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };

  return (
    <div className="w-full">
      {/* 헤더 */}
      <header className="mb-section-lg">
        <h1 className="text-h1 font-bold text-theme">시리즈</h1>
        <p className="mt-2 text-meta text-muted">
          {seriesList.length}개의 시리즈
        </p>
      </header>

      <section className="flex flex-col gap-item">
        {seriesList.map(([key, value], index) => (
          <SeriesListItem
            key={key}
            seriesKey={key}
            title={value.title}
            count={value.count}
            latestDate={value.latestDate}
            index={index}
          />
        ))}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionStructuredData),
        }}
      />
    </div>
  );
}

export default SeriesPage;
