import { BASE_URL } from "@/constants/basic.constants";
import { DEFAULT_PAGE_SIZE } from "@/constants/post.constants";
import BlogPageTemplate from "@/templates/BlogPageTemplate";
import { getAllPosts } from "@/utils/post";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { totalPostCount } = await getAllPosts({});
  const totalPages = Math.ceil(totalPostCount / DEFAULT_PAGE_SIZE);

  if (totalPages <= 1) return [];

  return Array.from({ length: totalPages - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

export const generateMetadata = ({ params }: { params: { page: string } }) => {
  const page = Number(params.page);
  const pageSuffix = Number.isFinite(page) ? ` (page ${page})` : "";
  const url = `/blog/page/${params.page}`;

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

const BlogPage = async ({ params }: { params: { page: string } }) => {
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

  const currentPage = Number(params.page);
  if (!Number.isFinite(currentPage) || currentPage <= 1) {
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
