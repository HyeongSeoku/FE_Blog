import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import MonthlySection from "@/components/MonthlySection";
import BlogDateTemplate from "@/templates/BlogDateTemplate";
import {
  getAllYears,
  getMonthlyPostCounts,
  getPostsByDate,
} from "@/utils/post";
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
      ? `/blog/archive/${year}/p/${currentPage}`
      : `/blog/archive/${year}`;

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

const BlogArchiveYearPage = async ({
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
        item: `${BASE_URL}/blog/archive/${year}`,
      },
    ],
  };
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog/archive/${year}`,
    url: `${BASE_URL}/blog/archive/${year}`,
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

  // 월별 데이터 가져오기
  const monthlyData = await getMonthlyPostCounts(year);

  if (totalPages && totalPages < currentPage) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 월별 그리드 섹션 */}
      <MonthlySection year={year} monthlyData={monthlyData} />

      {/* 구분선 */}
      <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-12" />

      {/* 게시물 리스트 (기존 템플릿 대신 직접 렌더링하거나, 템플릿의 헤더를 숨기는 옵션을 추가하여 사용) */}
      {/* BlogDateTemplate은 헤더를 포함하므로, 여기서는 그냥 내부 구성요소를 재사용하거나, 
          Template을 그대로 쓰되 헤더가 중복되지 않도록 주의해야 합니다. 
          MonthlySection이 이미 'Archive' 헤더 역할을 하므로, BlogDateTemplate의 심플 헤더는 '게시물 목록' 정도로 보이게 됩니다. */}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          전체 게시물 목록
        </h3>
      </div>

      <BlogDateTemplate
        dateText={yearText}
        postList={postList}
        postCount={totalPostCount}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/archive/${year}`}
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
    </div>
  );
};

export default BlogArchiveYearPage;
