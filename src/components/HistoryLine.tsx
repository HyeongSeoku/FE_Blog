"use client";

const FIRST_YEAR = 2022;
const currentYear = new Date().getFullYear();

interface HistoryItemProps {
  year: number;
}

const HistoryItem = ({ year }: HistoryItemProps) => {
  return (
    <div className="flex flex-col justify-center">
      <span>{year}</span>
      <div className="relative w-5 h-5">
        {year === currentYear && (
          <div className="absolute top-1/2 left-1/2 w-7 h-7 rounded-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2 animate-blinkEaseInOut"></div>
        )}
        <div className="absolute top-1/2 left-1/2 w-5 h-5 rounded-full bg-[var(--text-color)] transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

const HistoryLine = () => {
  const yearList = Array.from(
    { length: currentYear - FIRST_YEAR + 1 },
    (_, index) => FIRST_YEAR + index,
  );

  return (
    <article className="flex gap-0">
      {yearList.map((year, idx) => (
        <HistoryItem key={`${year}_${idx}`} year={year} />
      ))}
    </article>
  );
};

export default HistoryLine;
