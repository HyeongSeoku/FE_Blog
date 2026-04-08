import type { PluggableList } from "unified";
import type { extractHeadings } from "@/utils/mdx";

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
  children: Array<{ type: string; value?: string; [key: string]: unknown }>;
  properties?: Record<string, unknown>;
};

export type RehypePluginList = PluggableList;

// 공통 반환형 (제네릭)
export type GetMdxContentsBase<S> = {
  source: S; // string | MDXRemoteSerializeResult
  frontMatter: FrontMatterProps;
  readingTime: number;
  heading: ReturnType<typeof extractHeadings>;
  previousPost: { slug: string; title: string } | null;
  nextPost: { slug: string; title: string } | null;
  relatedPosts: { slug: string; title: string }[];
  rehypePlugins: RehypePluginList;
};

export interface HeadingItems {
  value?: string;
  type?: string;
}

export type SerializeOptions = {
  mdxOptions?: {
    remarkPlugins?: PluggableList;
    rehypePlugins?: PluggableList;
    format?: "mdx" | "md";
  };
  scope?: Record<string, unknown>;
};
