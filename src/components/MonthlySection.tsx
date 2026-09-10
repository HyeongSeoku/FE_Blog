import Link from "next/link";

interface MonthData {
  month: string; // "01", "02", etc.
  count: number;
}

interface MonthlySectionProps {
  year: string;
  monthlyData: MonthData[];
}

export default function MonthlySection({
  year,
  monthlyData,
}: MonthlySectionProps) {
  if (!monthlyData.length) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sk-label text-muted">월별</h2>
      <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        {monthlyData.map((item) => (
          <li key={item.month}>
            <Link
              href={`/archive/${year}/${item.month}`}
              className="text-sk-meta text-theme transition-opacity hover:opacity-[.55]"
            >
              {parseInt(item.month, 10)}월
              <sup className="ml-0.5 font-normal text-muted">{item.count}</sup>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
