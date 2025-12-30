import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { formatToKoreanMonth } from "@/utils/date";
import { getAllMonths, getPostsByDate } from "@/utils/post";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const months = await getAllMonths();
  const params = await Promise.all(
    months.map(async (month) => {
      const { totalPostCount } = await getPostsByDate({
        type: "month",
        date: month,
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

      if (totalPages <= 1) return [];

      return Array.from({ length: totalPages - 1 }, (_, index) => ({
        month,
        page: String(index + 2),
      }));
    }),
  );

  return params.flat();
}

export const generateMetadata = ({
  params,
}: {
  params: { month: string; page: string };
}) => {
  const { month, page } = params;
  const pageNumber = Number(page);
  const pageSuffix = Number.isFinite(pageNumber) ? ` (page ${page})` : "";

  return {
    title: `${BASE_META_TITLE}|${month}월 게시물${pageSuffix}`,
    description: `${month}월 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${month} 게시물${pageSuffix}`,
      description: `${month} 작성된 블로그 글 목록을 확인하세요.`,
      url: `/blog/month/${month}/page/${page}`,
      type: "website",
    },
    alternates: {
      canonical: `/blog/month/${month}/page/${page}`,
    },
  };
};

const BlogMonthPage = async ({
  params,
}: {
  params: { month: string; page: string };
}) => {
  const { month, page } = params;
  const formattedMonth = formatToKoreanMonth(month);
  const currentPage = Number(page);

  if (!Number.isFinite(currentPage) || currentPage <= 1) {
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
        name: `${month}월`,
        item: `${BASE_URL}/blog/month/${month}`,
      },
    ],
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/month/${month}`,
    url: `${BASE_URL}/blog/month/${month}`,
    name: `${formattedMonth} 게시물`,
    description: `${formattedMonth}에 작성된 블로그 글 모음 페이지입니다.`,
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };

  const { postList, totalPostCount } = await getPostsByDate({
    type: "month",
    date: month,
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
        dateText={formattedMonth}
        postList={postList}
        postCount={totalPostCount}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/month/${month}`}
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

export default BlogMonthPage;
