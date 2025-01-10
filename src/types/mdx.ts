import { MDXRemoteSerializeResult } from "next-mdx-remote";
export interface FrontMatterProps {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  subCategory?: string;
  tags?: string[];
}

export interface HeadingsProps {
  id: string;
  text: string;
  level: number;
  isVisit: boolean;
}

export interface RelatedPost {
  slug: string;
  title: string;
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
