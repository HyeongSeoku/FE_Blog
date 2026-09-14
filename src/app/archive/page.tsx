import type { Metadata } from "next";
import Link from "next/link";
import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getDate } from "@/utils/date";
import { getAllPosts } from "@/utils/post";

export function generateMetadata(): Metadata {
  const metaTitle = `${BASE_META_TITLE} | Archive`;
  const metaDescription =
    "생각, 튜토리얼, 그리고 개발 로그들의 시간순 모음입니다.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "/archive",
      type: "website",
    },
    alternates: { canonical: "/archive" },
  };
}

interface YearGroup {
  year: number;
  posts: {
    slug: string;
    title: string;
    createdAt: string;
    month: string;
    day: string;
  }[];
}

async function ArchivePage() {
  const { postList, totalPostCount } = await getAllPosts({ isSorted: true });

  // 년도별로 그룹핑
  const yearGroups: YearGroup[] = [];
  const yearMap = new Map<number, YearGroup>();

  postList.forEach((post) => {
    const year = Number(getDate("YYYY", post.createdAt));
    const month = getDate("MMM", post.createdAt);
    const day = getDate("DD", post.createdAt);

    if (Number.isNaN(year)) return;

    let group = yearMap.get(year);
    if (!group) {
      group = { year, posts: [] };
      yearMap.set(year, group);
      yearGroups.push(group);
    }

    group.posts.push({
      slug: post.slug,
      title: post.title,
      createdAt: post.createdAt,
      month,
      day,
    });
  });

  // 년도 내림차순 정렬
  yearGroups.sort((a, b) => b.year - a.year);

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
        name: "Archive",
        item: `${BASE_URL}/archive`,
      },
    ],
  };

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/archive`,
    url: `${BASE_URL}/archive`,
    name: "Archive",
    description: "생각, 튜토리얼, 그리고 개발 로그들의 시간순 모음입니다.",
    isPartOf: {
      "@type": "Blog",
      name: BASE_META_TITLE,
      url: BASE_URL,
    },
  };

  return (
    <div className="w-full">
      {/* 헤더 */}
      <header className="mb-section-lg">
        <h1 className="text-h1 font-bold text-theme">전체 목록</h1>
        <p className="mt-2 text-meta text-muted">{totalPostCount}개의 글</p>
      </header>

      {/* 년도별 그룹 */}
      <div className="flex flex-col gap-section-lg">
        {yearGroups.map(({ year, posts }) => (
          <section key={year} className="flex flex-col gap-4">
            <Link
              href={`/archive/${year}`}
              className="w-fit text-label text-muted transition-opacity hover:opacity-[.55]"
            >
              {year}
            </Link>

            <ul className="flex flex-col gap-item">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 transition-opacity hover:opacity-[.55]"
                  >
                    <span className="min-w-[180px] flex-1 text-body text-theme">
                      {post.title}
                    </span>
                    <time
                      dateTime={getDate("YYYY-MM-DD", post.createdAt)}
                      className="shrink-0 text-meta text-muted"
                    >
                      {post.month} {post.day}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

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
}

export default ArchivePage;
