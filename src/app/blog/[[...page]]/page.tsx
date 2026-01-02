import { BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getAllPosts } from "@/utils/post";
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
  const { totalPostCount } = await getAllPosts({});
  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  const params: { page?: string[] }[] = [{ page: [] }];

  for (let page = 2; page <= totalPages; page += 1) {
    params.push({ page: ["p", String(page)] });
  }

  return params;
}

export const generateMetadata = ({
  params,
}: {
  params: { page?: string[] };
}) => {
  const currentPage = parsePageParam(params.page);
  const isFirstPage = currentPage === 1;
  const url = isFirstPage ? "/blog" : `/blog/p/${currentPage}`;
  const pageSuffix =
    currentPage && currentPage > 1 ? ` (page ${currentPage})` : "";

  return {
    title: `블로그 페이지${pageSuffix}`,
    description: "최신 블로그 글 목록을 확인하세요.",
    openGraph: {
      title: `블로그 페이지${pageSuffix}`,
      description: "최신 블로그 글 목록을 확인하세요.",
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
};

const BlogPage = async ({ params }: { params: { page?: string[] } }) => {
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
    ],
  };

  const currentPage = parsePageParam(params.page);
  if (!currentPage) {
    notFound();
  }

  const { postList, totalPostCount, categoryCounts } = await getAllPosts({
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);
  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <>
      <BlogPageTemplate
        postList={postList}
        currentPage={currentPage}
        totalPostCount={totalPostCount}
        categoryCounts={categoryCounts}
        totalPages={totalPages}
        basePath="/blog"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
    </>
  );
};

export default BlogPage;
