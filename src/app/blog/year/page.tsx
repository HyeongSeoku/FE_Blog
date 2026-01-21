import { BASE_META_TITLE, BASE_URL } from "@/constants/basic.constants";
import { getAllPosts } from "@/utils/post";
import { getDate } from "@/utils/date";
import Link from "next/link";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  const metaTitle = `${BASE_META_TITLE} | Archive`;
  const metaDescription =
    "A chronological collection of thoughts, tutorials, and development logs.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "/blog/year",
      type: "website",
    },
    alternates: { canonical: "/blog/year" },
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
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = getDate("MMM", post.createdAt);
    const day = getDate("DD", post.createdAt);

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
        item: `${BASE_URL}/blog/year`,
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
          Archive
          <span className="ml-3 text-lg font-normal text-gray-400 dark:text-gray-500">
            ({totalPostCount} posts)
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          A chronological collection of thoughts, tutorials, and development
          logs.
        </p>
      </div>

      {/* 년도별 그룹 */}
      <div className="space-y-16">
        {yearGroups.map(({ year, posts }) => (
          <section key={year} className="relative">
            {/* 년도 */}
            <h2 className="text-6xl font-bold text-gray-100 dark:text-gray-800/50 absolute -left-4 top-0 select-none pointer-events-none mobile:relative mobile:left-0 mobile:text-4xl mobile:text-gray-200 mobile:dark:text-gray-700 mobile:mb-4">
              {year}
            </h2>

            {/* 글 목록 */}
            <div className="ml-24 mobile:ml-0 border-l border-gray-200 dark:border-gray-700 pl-8 mobile:pl-4">
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.slug} className="group">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="flex items-baseline gap-4 py-2 -ml-8 pl-8 mobile:-ml-4 mobile:pl-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-r-lg transition-colors"
                    >
                      {/* 날짜 */}
                      <time
                        dateTime={post.createdAt}
                        className="flex-shrink-0 w-16 text-sm text-gray-400 dark:text-gray-500 font-mono"
                      >
                        {post.month} {post.day}
                      </time>
                      {/* 제목 */}
                      <span className="text-gray-900 dark:text-white font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
    </div>
  );
}

export default ArchivePage;
