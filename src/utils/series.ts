import rawSeriesData from "@/data/series.json";
import { FrontMatterProps } from "@/types/mdx";
import { SeriesListData, SeriesMetadata } from "@/types/series";
import { getAllPosts } from "./post";

const seriesData = rawSeriesData as Record<
  string,
  {
    title: string;
    description: string;
    thumbnail: string;
  }
>;

export const getAllSeriesMetadata = async (): Promise<SeriesListData> => {
  const { seriesCounts } = await getAllPosts({});

  const merged: SeriesListData = Object.entries(seriesData).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        count: seriesCounts?.[key] ?? 0,
      };
      return acc;
    },
    {} as SeriesListData,
  );

  return merged;
};

// 특정 시리즈 메타데이터 가져오기
export const getSeriesMetadata = (seriesKey: string): SeriesMetadata | null => {
  return seriesData[seriesKey] || null;
};

// 특정 시리즈에 속한 글 모으기 및 정렬
export const getPostsBySeries = (
  allPosts: FrontMatterProps[],
  seriesKey: string,
): FrontMatterProps[] => {
  return allPosts
    .filter((post) => post.series === seriesKey)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
};

// 모든 시리즈 키 리스트 반환
export const getAllSeriesKeys = (): string[] => {
  return Object.keys(seriesData);
};
