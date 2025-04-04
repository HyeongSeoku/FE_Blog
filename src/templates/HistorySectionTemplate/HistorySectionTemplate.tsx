"use client";

import "./history-section-template.css";
import { PUBLIC_IMG_PATH } from "@/constants/basic.constants";
import {
  HISTORY_LIST,
  HISTORY_LIST_ITEM_PROPS,
} from "@/constants/history.constant";

const FIRST_YEAR = 2022;
const currentYear = new Date().getFullYear();

interface HistoryItemProps {
  targetYear: number;
  currentJob?: HISTORY_LIST_ITEM_PROPS;
}

const HistoryItem = ({ targetYear, currentJob }: HistoryItemProps) => {
  const yearData = HISTORY_LIST.filter(({ year }) => targetYear === year);

  return (
    <section className="history-item justify-center flex flex-col w-full h-full min-w-40">
      <time
        dateTime={`${targetYear}`}
        className="block mb-2 text-lg font-semibold"
      >
        {targetYear}
      </time>
      <div className="history-circle relative w-full min-h-5">
        {targetYear === currentYear && (
          <div className="absolute top-1/2 left-5 w-8 h-8 rounded-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2 animate-blinkEaseInOut z-10"></div>
        )}
        <div className="absolute top-1/2 left-5 w-5 h-5 rounded-full bg-[var(--text-color)] transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
      </div>
      {!!yearData.length ? (
        <div className="history-detail-container ">
          {yearData.map(({ month, title, description, logoSrc }, idx) => (
            <div
              key={`${month}_${idx}`}
              className="flex items-center gap-2 pl-3 mb-2 min-h-20"
            >
              <span className="text-xl font-bold">{month}</span>
              <img
                src={`${PUBLIC_IMG_PATH}/${logoSrc}`}
                className="bg-slate-400"
                width={30}
              />
              <div>
                <div className="">{title}</div>
                <div className="text-xs font-thin opacity-55">
                  {description}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="history-detail-container ">
          <div className="flex items-center gap-2 pl-3 mb-2 min-h-20">
            <span className="text-xl font-bold">{currentJob?.month}</span>
            <img
              src={`${PUBLIC_IMG_PATH}/${currentJob?.logoSrc}`}
              className="bg-slate-400"
              width={30}
            />
            <div>
              <div className="">{currentJob?.title}</div>
              <div className="text-xs font-thin opacity-55">
                {currentJob?.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const HistorySectionTemplate = () => {
  const yearList = Array.from(
    { length: currentYear - FIRST_YEAR + 1 },
    (_, index) => FIRST_YEAR + index,
  );

  const currentJob = HISTORY_LIST.findLast(({ isCurrent }) => isCurrent);

  return (
    <article className="history-container flex max-w-3xl justify-between relative overflow-x-scroll z-10">
      {yearList.map((year, idx) => (
        <HistoryItem
          key={`${year}_${idx}`}
          targetYear={year}
          currentJob={currentJob}
        />
      ))}
    </article>
  );
};

export default HistorySectionTemplate;
