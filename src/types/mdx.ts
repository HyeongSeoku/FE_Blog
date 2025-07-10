import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { RelatedPost } from "./posts";
export interface FrontMatterProps {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  subCategory?: string;
  tags?: string[];
  thumbnail?: string;
  series?: string;
  seriesOrder?: number;
}

export interface HeadingsProps {
  id: string;
  text: string;
  level: number;
  isVisit: boolean;
}

export type ExtendedElement = {
  tagName?: string;
  children: Array<{ type: string; value?: string; [key: string]: any }>;
  properties?: Record<string, any>;
};

export interface getMdxContentsResponse {
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatterProps;
  readingTime?: number;
  heading?: HeadingsProps[];
  previousPost: RelatedPost | null;
  nextPost: RelatedPost | null;
  relatedPosts: RelatedPost[] | null;
}

export interface HeadingItems {
  value?: string;
  type?: string;
}
