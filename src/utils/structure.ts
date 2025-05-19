import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";

export interface BaseStructuredDataProps {
  context?: string;
  type?: string;
}

export interface OrganizationData extends BaseStructuredDataProps {
  type?: "Organization";
  name: string;
  url?: string;
  logo: {
    type?: "ImageObject";
    url: string;
  };
}
export interface PersonData extends BaseStructuredDataProps {
  type?: "Person";
  name: string;
}

export interface ArticleData extends BaseStructuredDataProps {
  type?: "Article";
  headline: string;
  description: string;
  image: string;
  author: PersonData;
  publisher: OrganizationData;
  datePublished: string;
  url: string;
  mainEntityOfPage: {
    type?: "WebPage";
    id: string;
  };
}

export interface BreadcrumbListData {
  type?: "BreadcrumbList";
  itemListElement: {
    type?: "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

export const getStructuredData = (
  data: OrganizationData | PersonData | ArticleData = {
    type: "Organization",
    name: BASE_META_TITLE,
    logo: { url: `${BASE_URL}/image/logo.svg` },
  },
) => {
  const {
    context = "https://schema.org",
    type = "Organization",
    ...rest
  } = data;

  const base = {
    "@context": context,
    "@type": type,
    ...rest,
  };

  // Organization일 경우 logo @type 처리
  if (type === "Organization" && "logo" in rest) {
    const orgData = rest as OrganizationData;
    return {
      ...base,
      logo: {
        "@type": orgData.logo.type || "ImageObject",
        url: orgData.logo.url,
      },
    };
  }

  // Article일 경우 publisher, mainEntityOfPage 처리
  if (type === "Article") {
    const articleData = rest as ArticleData;
    return {
      ...base,
      publisher: {
        "@type": articleData.publisher.type || "Organization",
        name: articleData.publisher.name,
        ...(articleData.publisher.url
          ? { url: articleData.publisher.url }
          : {}),
        logo: {
          "@type": articleData.publisher.logo.type || "ImageObject",
          url: articleData.publisher.logo.url,
        },
      },
      author: {
        "@type": articleData.author.type || "Person",
        name: articleData.author.name,
      },
      mainEntityOfPage: {
        "@type": articleData.mainEntityOfPage.type || "WebPage",
        "@id": articleData.mainEntityOfPage.id,
      },
    };
  }

  return base;
};
