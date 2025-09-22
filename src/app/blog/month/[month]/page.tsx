import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import { formatToKoreanMonth } from "@/utils/date";
import { getPostsByDate } from "@/utils/post";
import { redirect } from "next/navigation";

interface BlogMonthPageProps {
  params: { month: string };
  searchParams: { [key: string]: string | undefined };
}

export const generateMetadata = ({
  params,
  searchParams,
}: BlogMonthPageProps) => {
  const { month } = params;
  const pageParam = searchParams.page;
  const isFirstPage = !pageParam || pageParam === "1";

  return {
    title: `${BASE_META_TITLE}|${month}월 게시물`,
    description: `${month}월 작성된 블로그 글 목록을 확인하세요.`,
    openGraph: {
      title: `${month} 게시물`,
      description: `${month} 작성된 블로그 글 목록을 확인하세요.`,
      url: isFirstPage
        ? `/blog/month/${month}`
        : `/blog/month/${month}?page=${pageParam}`,
      type: "website",
    },
    alternates: {
      canonical: isFirstPage
        ? `/blog/month/${month}`
        : `/blog/month/${month}?page=${pageParam}`,
    },
  };
};

const BlogMonthPage = async ({ params, searchParams }: BlogMonthPageProps) => {
  const { month } = params;
  const formattedMonth = formatToKoreanMonth(month);

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

  const pageParam = searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isInvalidPageParam = isNaN(currentPage) || currentPage <= 0;

  if (isInvalidPageParam) {
    redirect(`/blog/month/${month}`);
  }

  const { postList, totalPostCount } = await getPostsByDate({
    type: "month",
    date: month,
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  return (
    <>
      <BlogDateTemplate
        dateText={formattedMonth}
        postList={postList}
        postCount={totalPostCount}
        currentPage={currentPage}
        totalPages={totalPages}
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
