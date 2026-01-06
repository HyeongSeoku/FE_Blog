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
      const pageParams: { month: string; page?: string[] }[] = [
        { month, page: [] },
      ];

      for (let page = 2; page <= totalPages; page += 1) {
        pageParams.push({ month, page: ["p", String(page)] });
      }

      return pageParams;
    }),
  );

  return params.flat();
}

export const generateMetadata = ({
  params,
}: {
  params: { month: string; page?: string[] };
}) => {
  const { month } = params;
  const normalizedMonth = month.replace(/\./g, "-");
  const currentPage = parsePageParam(params.page);
  const pageSuffix =
    currentPage && currentPage > 1 ? ` (page ${currentPage})` : "";
  const url =
    currentPage && currentPage > 1
      ? `/blog/month/${normalizedMonth}/p/${currentPage}`
      : `/blog/month/${normalizedMonth}`;

  return {
    title: `${BASE_META_TITLE}|${month}월 게시물${pageSuffix}`,
    description: `${month}월 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${month} 게시물${pageSuffix}`,
      description: `${month} 작성된 블로그 글 목록을 확인하세요.`,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
};

const BlogMonthPage = async ({
  params,
}: {
  params: { month: string; page?: string[] };
}) => {
  const { month } = params;
  const normalizedMonth = month.replace(/\./g, "-");
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
        name: `${normalizedMonth}월`,
        item: `${BASE_URL}/blog/month/${normalizedMonth}`,
      },
    ],
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/month/${normalizedMonth}`,
    url: `${BASE_URL}/blog/month/${normalizedMonth}`,
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
        basePath={`/blog/month/${normalizedMonth}`}
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
