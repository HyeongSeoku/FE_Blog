import rawSeriesData from "@/data/series.json";
import { SeriesListData, SeriesMetadata } from "@/types/series";
import { getAllPosts } from "./post";
import { PostDataProps } from "@/types/posts";
import dayjs from "dayjs";

interface GetAllSeriesMetadataProps {
  sortByLatestPost?: boolean; // undefined면 정렬 안함
}

const seriesData = rawSeriesData as Record<
  string,
  {
    title: string;
    description: string;
    thumbnail: string;
  }
>;

export const getAllSeriesMetadata = async (
  props?: GetAllSeriesMetadataProps,
): Promise<SeriesListData> => {
  const { seriesCounts, postList } = await getAllPosts({});

  const merged: SeriesListData = Object.entries(seriesData).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        count: seriesCounts?.[key] ?? 0,
        latestDate: undefined,
      };

      if (props?.sortByLatestPost) {
        const postsInSeries = postList.filter((post) => post.series === key);
        const latest = postsInSeries.reduce(
          (latest, post) => {
            const normalizedDate = post.createdAt.replace(/\./g, "-");
            const date = dayjs(normalizedDate);
            if (!date.isValid()) return latest;
            return !latest || date.isAfter(latest) ? date : latest;
          },
          undefined as dayjs.Dayjs | undefined,
        );

        acc[key].latestDate = latest?.toISOString() ?? undefined;
      }

      return acc;
    },
    {} as SeriesListData,
  );

  if (props?.sortByLatestPost) {
    const sorted = Object.entries(merged)
      .sort(([, a], [, b]) => {
        const dateA = a.latestDate ? new Date(a.latestDate).getTime() : 0;
        const dateB = b.latestDate ? new Date(b.latestDate).getTime() : 0;
        return dateB - dateA;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as SeriesListData);

    return sorted;
  }

  return merged;
};
// 특정 시리즈 메타데이터 가져오기
export const getSeriesMetadata = (seriesKey: string): SeriesMetadata | null => {
  return seriesData[seriesKey] || null;
};

// 특정 시리즈에 속한 글 모으기 및 정렬
export const getPostsBySeries = (
  allPosts: PostDataProps[],
  seriesKey: string,
): PostDataProps[] => {
  return allPosts
    .filter((post) => post.series === seriesKey)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
};

// 모든 시리즈 키 리스트 반환
export const getAllSeriesKeys = (): string[] => {
  return Object.keys(seriesData);
};
