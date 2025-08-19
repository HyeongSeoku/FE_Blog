// utils/structure.ts
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";

/** 공통 베이스 타입 */
export interface BaseStructuredDataProps {
  /** 기본값: "https://schema.org" */
  context?: string;
  type:
    | "Organization"
    | "Person"
    | "Article"
    | "BlogPosting"
    | "BreadcrumbList"
    | "WebPage"
    | "ImageObject";
}

/** Organization */
export interface OrganizationData extends BaseStructuredDataProps {
  type: "Organization";
  name: string;
  url?: string;
  logo: {
    type?: "ImageObject";
    url: string;
    width?: number;
    height?: number;
  };
}

/** Person */
export interface PersonData extends BaseStructuredDataProps {
  type: "Person";
  name: string;
  url?: string;
}

/** Article / BlogPosting 공통 */
export interface ArticleLikeData extends BaseStructuredDataProps {
  type: "Article" | "BlogPosting";
  headline: string;
  description: string;
  /** string 또는 string[] 모두 허용 */
  image?: string | string[];
  author: PersonData;
  publisher: OrganizationData;
  datePublished: string; // ISO or YYYY-MM-DD
  dateModified?: string;
  url: string;
  mainEntityOfPage: {
    type?: "WebPage";
    id: string;
  };
  inLanguage?: string; // e.g., "ko-KR"
  keywords?: string[]; // 내부에서 join(", ")
  articleSection?: string; // 카테고리
  wordCount?: number;
}

/** BreadcrumbList */
export interface BreadcrumbListData extends BaseStructuredDataProps {
  type: "BreadcrumbList";
  itemListElement: Array<{
    type?: "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

/** 유니온 인풋 타입 */
export type StructuredInput =
  | OrganizationData
  | PersonData
  | ArticleLikeData
  | BreadcrumbListData;

/** @context / @type 공통 매핑 */
function withContextAndType<T extends BaseStructuredDataProps>(
  data: T,
): Record<string, unknown> {
  const { context = "https://schema.org", type, ...rest } = data;
  return {
    "@context": context,
    "@type": type,
    ...rest,
  };
}

/** Organization 빌더 */
export function buildOrganization(
  data: OrganizationData,
): Record<string, unknown> {
  const base = withContextAndType<OrganizationData>(data);

  return {
    ...base,
    logo: {
      "@type": data.logo.type || "ImageObject",
      url: data.logo.url,
      ...(typeof data.logo.width === "number"
        ? { width: data.logo.width }
        : {}),
      ...(typeof data.logo.height === "number"
        ? { height: data.logo.height }
        : {}),
    },
  };
}

/** Person 빌더 */
export function buildPerson(data: PersonData): Record<string, unknown> {
  return withContextAndType<PersonData>(data);
}

/** Article / BlogPosting 빌더 */
export function buildArticleLike(
  data: ArticleLikeData,
): Record<string, unknown> {
  return {
    ...withContextAndType<ArticleLikeData>(data),
    publisher: buildOrganization(data.publisher),
    author: {
      "@type": data.author.type || "Person",
      name: data.author.name,
      ...(data.author.url ? { url: data.author.url } : {}),
    },
    mainEntityOfPage: {
      "@type": data.mainEntityOfPage.type || "WebPage",
      "@id": data.mainEntityOfPage.id,
    },
    ...(typeof data.image === "string"
      ? { image: [data.image] }
      : Array.isArray(data.image)
        ? { image: data.image }
        : {}),
    ...(Array.isArray(data.keywords) && data.keywords.length > 0
      ? { keywords: data.keywords.join(", ") }
      : {}),
    ...(data.inLanguage ? { inLanguage: data.inLanguage } : {}),
    ...(data.articleSection ? { articleSection: data.articleSection } : {}),
    ...(typeof data.wordCount === "number"
      ? { wordCount: data.wordCount }
      : {}),
  };
}

/** BreadcrumbList 빌더 */
export function buildBreadcrumbList(
  data: BreadcrumbListData,
): Record<string, unknown> {
  return {
    ...withContextAndType<BreadcrumbListData>(data),
    itemListElement: data.itemListElement.map((item) => ({
      "@type": item.type || "ListItem",
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };
}

/**
 * 편의 팩토리:
 *  - 들어온 타입에 따라 적절한 빌더 호출
 *  - 기본값: Organization(BASE_META_TITLE)
 */
export function getStructuredData(
  data: StructuredInput = {
    type: "Organization",
    name: BASE_META_TITLE,
    url: BASE_URL,
    logo: { url: `${BASE_URL}/image/logo.svg` },
  },
): Record<string, unknown> {
  switch (data.type) {
    case "Organization":
      return buildOrganization(data);
    case "Person":
      return buildPerson(data);
    case "Article":
    case "BlogPosting":
      return buildArticleLike(data);
    case "BreadcrumbList":
      return buildBreadcrumbList(data);
    default:
      return withContextAndType(data);
  }
}
