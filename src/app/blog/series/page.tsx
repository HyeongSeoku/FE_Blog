import SeriesCard from "@/components/SeriesCard";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getAllSeriesMetadata } from "@/utils/series";
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
      url: "/blog/series",
      type: "website",
      images: [],
    },
    alternates: { canonical: "/blog/series" },
  };
}

async function SeriesPage() {
  const seriesData = await getAllSeriesMetadata();
  const seriesList = Object.entries(seriesData);

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/series`,
    url: `${BASE_URL}/blog/series`,
    name: "시리즈",
    description: "블로그 연재 시리즈 목록입니다.",
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          시리즈
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {seriesList.length}개의 시리즈
        </p>
      </div>

      {/* 시리즈 그리드 */}
      <section className="grid grid-cols-1 gap-6 mobile:gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
        {seriesList.map(([key, value], index) => (
          <SeriesCard
            key={key}
            seriesKey={key}
            seriesIndex={index}
            title={value.title}
            description={value.description}
            thumbnail={value.thumbnail}
            seriesCount={value.count}
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
