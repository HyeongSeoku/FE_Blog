import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { getAllYears, getPostsByDate } from "@/utils/post";
import { notFound } from "next/navigation";

export const dynamicParams = false;

const parsePageParam = (page?: string[]) => {
  if (!page || page.length === 0) return 1;
  if (page.length !== 2 || page[0] !== "p") return null;
  const current = Number(page[1]);
  if (!Number.isFinite(current) || current < 2) return null;
  return current;
};

export async function generateStaticParams() {
  const years = await getAllYears();
  const params = await Promise.all(
    years.map(async (year) => {
      const { totalPostCount } = await getPostsByDate({
        type: "year",
        date: year,
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);
      const pageParams: { year: string; page?: string[] }[] = [
        { year, page: [] },
      ];

      for (let page = 2; page <= totalPages; page += 1) {
        pageParams.push({ year, page: ["p", String(page)] });
      }

      return pageParams;
    }),
  );

  return params.flat();
}

export const generateMetadata = ({
  params,
}: {
  params: { year: string; page?: string[] };
}) => {
  const { year } = params;
  const currentPage = parsePageParam(params.page);
  const pageSuffix =
    currentPage && currentPage > 1 ? ` (page ${currentPage})` : "";
  const url =
    currentPage && currentPage > 1
      ? `/blog/year/${year}/p/${currentPage}`
      : `/blog/year/${year}`;

  return {
    title: `${year}년도 게시물${pageSuffix}`,
    description: `${year}년도 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${year}년도 게시물${pageSuffix}`,
      description: `${year}년도 작성된 블로그 글 목록을 확인하세요.`,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
};

const BlogYearPage = async ({
  params,
}: {
  params: { year: string; page?: string[] };
}) => {
  const { year } = params;
  const yearText = `${year}년`;
  const currentPage = parsePageParam(params.page);

  if (!currentPage) {
    notFound();
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `블로그`,
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${year}년`,
        item: `${BASE_URL}/blog/year/${year}`,
      },
    ],
  };
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/year/${year}`,
    url: `${BASE_URL}/blog/year/${year}`,
    name: `${yearText} 게시물`,
    description: `${yearText}에 작성된 블로그 글 모음 페이지입니다.`,
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };

  const { postList, totalPostCount } = await getPostsByDate({
    type: "year",
    date: year,
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  if (totalPages && totalPages < currentPage) {
    notFound();
  }

  return (
    <>
      <BlogDateTemplate
        dateText={yearText}
        postList={postList}
        postCount={totalPostCount}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/year/${year}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionStructuredData),
        }}
      />
    </>
  );
};

export default BlogYearPage;
