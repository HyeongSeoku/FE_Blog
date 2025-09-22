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
      url: "/series",
      type: "website",
      images: [],
    },
    alternates: { canonical: "/series" },
  };
}

async function SeriesPage() {
  const seriesData = await getAllSeriesMetadata();
  const seriesList = Object.entries(seriesData);

  return (
    <div>
      <strong className="text-3xl">시리즈 리스트</strong>
      <section className="grid grid-cols-4 gap-3 md-lg:grid-cols-2 md:grid-cols-2">
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
