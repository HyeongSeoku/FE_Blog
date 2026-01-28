import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { formatToKoreanMonth } from "@/utils/date";
import { getAllMonths, getPostsByDate } from "@/utils/post";
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
  const months = await getAllMonths(); // returns "YYYY-MM"
  const params = await Promise.all(
    months.map(async (monthStr) => {
      const [year, month] = monthStr.split("-");
      const { totalPostCount } = await getPostsByDate({
        type: "month",
        date: monthStr,
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);
      const pageParams: { year: string; month: string; page?: string[] }[] = [
        { year, month, page: [] },
      ];

      for (let page = 2; page <= totalPages; page += 1) {
        pageParams.push({ year, month, page: ["p", String(page)] });
      }

      return pageParams;
    }),
  );

  return params.flat();
}

export const generateMetadata = ({
  params,
}: {
  params: { year: string; month: string; page?: string[] };
}) => {
  const { year, month } = params;
  const currentPage = parsePageParam(params.page);
  const pageSuffix =
    currentPage && currentPage > 1 ? ` (page ${currentPage})` : "";
  const url =
    currentPage && currentPage > 1
      ? `/blog/archive/${year}/${month}/p/${currentPage}`
      : `/blog/archive/${year}/${month}`;

  return {
    title: `${year}년 ${month}월 게시물${pageSuffix}`,
    description: `${year}년 ${month}월 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${year}년 ${month}월 게시물${pageSuffix}`,
      description: `${year}년 ${month}월 작성된 블로그 글 목록을 확인하세요.`,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
};

const BlogArchiveMonthPage = async ({
  params,
}: {
  params: { year: string; month: string; page?: string[] };
}) => {
  const { year, month } = params;
  const normalizedMonth = `${year}-${month}`;
  const currentPage = parsePageParam(params.page);

  if (!currentPage) {
    notFound();
  }

  const formattedMonth = formatToKoreanMonth(normalizedMonth);

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
        item: `${BASE_URL}/blog/archive/${year}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${month}월`,
        item: `${BASE_URL}/blog/archive/${year}/${month}`,
      },
    ],
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/archive/${year}/${month}`,
    url: `${BASE_URL}/blog/archive/${year}/${month}`,
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
    date: normalizedMonth,
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
        basePath={`/blog/archive/${year}/${month}`}
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

export default BlogArchiveMonthPage;
