import SeriesCard from "@/components/SeriesCard";
import { BASE_META_TITLE } from "@/constants/basic.constants";
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
      <section className="grid grid-cols-1 gap-6 min-md:grid-cols-2 min-lg:grid-cols-3">
        {seriesList.map(([key, value]) => (
          <SeriesCard
            key={key}
            seriesKey={key}
            title={value.title}
            description={value.description}
            thumbnail={value.thumbnail}
            seriesCount={value.count}
          />
        ))}
      </section>
    </div>
  );
}

export default SeriesPage;
