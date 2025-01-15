export type Category = "DEV" | "LIFE" | "ETC";
export type SubCategory =
  | "FE"
  | "BE"
  | "DEV_OTHER"
  | "WORK"
  | "HOBBY"
  | "BOOK"
  | "PHOTO"
  | "MUSIC";

export interface PostProps {
  title: string;
  description: string;
  category: Category;
  subCategory?: SubCategory;
  tags: string[];
  createdAt: string;
  thumbnail: string;
}

export interface PostDataProps extends PostProps {
  slug: string;
  content: string;
}

export interface getAllProjectsResponse {
  postList: PostDataProps[];
  totalPostCount: number;
}

export interface getAllPostsRequest {
  maxCount?: number;
  isSorted?: boolean;
  page?: number;
  pageSize?: number;
  targetYear?: number;
}

export interface RelatedPost {
  slug: string;
  title: string;
}
