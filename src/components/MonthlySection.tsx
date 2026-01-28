import Link from "next/link";
import classNames from "classnames";

interface MonthData {
  month: string; // "01", "02", etc.
  count: number;
}

interface MonthlySectionProps {
  year: string;
  monthlyData: MonthData[];
}

// 월별 색상 그라데이션 (계절감 반영)
const getMonthGradient = (month: string): string => {
  const m = parseInt(month, 10);
  if (m >= 3 && m <= 5) return "from-pink-400 to-rose-400"; // 봄
  if (m >= 6 && m <= 8) return "from-cyan-400 to-blue-500"; // 여름
  if (m >= 9 && m <= 11) return "from-amber-400 to-orange-500"; // 가을
  return "from-sky-500 to-indigo-500"; // 겨울
};

export default function MonthlySection({
  year,
  monthlyData,
}: MonthlySectionProps) {
  if (!monthlyData.length) return null;

  const totalPosts = monthlyData.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...monthlyData.map((item) => item.count)) || 1;

  return (
    <section className="my-16">
      {/* 섹션 헤더 */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link
            href="/blog/archive"
            className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors inline-block"
          >
            ← Back to Archive
          </Link>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
            {year}년 Archive
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

      {/* 월별 카드 그리드 */}
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4">
        {monthlyData.map((item) => {
          const percentage = (item.count / maxCount) * 100;

          return (
            <Link
              key={item.month}
              href={`/blog/archive/${year}/${item.month}`}
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
                  getMonthGradient(item.month),
                )}
                style={{ width: `${percentage}%` }}
              />

              {/* 장식 요소 */}
              <div
                className={classNames(
                  "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
                  `bg-gradient-to-br ${getMonthGradient(item.month)}`,
                )}
              />

              {/* 월 */}
              <div className="relative z-10">
                <span className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {parseInt(item.month, 10)}월
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
    </section>
  );
}
