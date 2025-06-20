// 시리즈 메타데이터 타입
export interface SeriesMetadata {
  title: string;
  description: string;
  thumbnail: string;
}

export interface SeriesResponse extends SeriesMetadata {
  count: number;
}

export type SeriesListData = Record<string, SeriesResponse>;
