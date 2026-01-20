import Link from "next/link";
import classNames from "classnames";

interface YearData {
  year: string;
  count: number;
}

interface ArchiveSectionProps {
  yearlyData: YearData[];
}

// 년도별 색상 그라데이션 (최신일수록 진한 색)
const getYearGradient = (index: number): string => {
  const gradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-blue-500",
  ];
  return gradients[index % gradients.length];
};

export default function ArchiveSection({ yearlyData }: ArchiveSectionProps) {
  if (!yearlyData.length) return null;

  const totalPosts = yearlyData.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...yearlyData.map((item) => item.count));

  return (
    <section className="my-16">
      {/* 섹션 헤더 */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 block">
            Archive
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            글 타임라인
          </h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-light text-gray-900 dark:text-white">
            {totalPosts}
          </span>
          <span className="text-xs font-medium tracking-wider uppercase text-gray-400 dark:text-gray-500 ml-1">
            Posts
          </span>
        </div>
      </div>

      {/* 년도별 카드 그리드 */}
      <div className="grid grid-cols-2 min-md:grid-cols-3 min-lg:grid-cols-4 gap-4">
        {yearlyData.map((item, index) => {
          const percentage = (item.count / maxCount) * 100;

          return (
            <Link
              key={item.year}
              href={`/blog/year/${item.year}`}
              className={classNames(
                "group relative overflow-hidden rounded-2xl p-6",
                "bg-white dark:bg-neutral-900/80",
                "border border-gray-200/60 dark:border-white/5",
                "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]",
                "hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
                "dark:shadow-none dark:hover:shadow-white/5",
                "transition-all duration-300 hover:-translate-y-1",
              )}
            >
              {/* 배경 그라데이션 바 */}
              <div
                className={classNames(
                  "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity",
                  getYearGradient(index),
                )}
                style={{ width: `${percentage}%` }}
              />

              {/* 장식 요소 */}
              <div
                className={classNames(
                  "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
                  `bg-gradient-to-br ${getYearGradient(index)}`,
                )}
              />

              {/* 년도 */}
              <div className="relative z-10">
                <span className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {item.year}
                </span>
              </div>

              {/* 게시물 수 */}
              <div className="relative z-10 mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-light text-gray-600 dark:text-gray-400">
                  {item.count}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  posts
                </span>
              </div>

              {/* 호버 시 화살표 */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <span className="text-gray-400 dark:text-gray-500">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 하단 전체 아카이브 링크 */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/blog"
          className={classNames(
            "inline-flex items-center gap-2 px-6 py-3 rounded-full",
            "bg-gray-100 dark:bg-white/5",
            "text-sm font-medium text-gray-700 dark:text-gray-300",
            "hover:bg-gray-200 dark:hover:bg-white/10",
            "transition-colors duration-300",
          )}
        >
          전체 아카이브 보기
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
