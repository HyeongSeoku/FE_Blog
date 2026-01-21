"use client";

import { SeriesResponse } from "@/types/series";
import SeriesCard from "@/components/SeriesCard";
import { SwiperComponent } from "@/components/SwiperComponent";
import { SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState } from "react";
import classNames from "classnames";
import Link from "next/link";

type SeriesListType = [string, SeriesResponse][];

interface MoSeriesSectionProps {
  seriesList: SeriesListType;
  maxLength?: number;
}

export function MoSeriesSection({
  seriesList,
  maxLength,
}: MoSeriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const showMoreBtn = !!maxLength && seriesList.length > maxLength;
  const validSeriesList = seriesList.filter(([, value]) => !!value?.title);

  return (
    <section className="overflow-hidden py-4 tablet:hidden">
      <SwiperComponent
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={1.2}
        centeredSlides={true}
        initialSlide={validSeriesList.length > 1 ? 1 : 0}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {seriesList.map(([key, value], idx) => (
          <SwiperSlide key={key}>
            <SeriesCard
              seriesKey={key}
              title={value.title}
              description={value.description}
              thumbnail={value.thumbnail}
              seriesCount={value.count}
              seriesIndex={idx}
              className={classNames(
                "transition-all will-change-transform duration-300",
                idx === activeIndex
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-70",
              )}
              isSelected={idx === activeIndex}
            />
          </SwiperSlide>
        ))}
        {showMoreBtn && (
          <SwiperSlide>
            <div className="flex items-center justify-center h-full min-h-[280px]">
              <Link
                className="px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300"
                href="/blog/series"
              >
                전체 시리즈 보기 →
              </Link>
            </div>
          </SwiperSlide>
        )}
      </SwiperComponent>
    </section>
  );
}

interface PcSeriesSectionProps {
  seriesList: SeriesListType;
  maxLength?: number;
}

export function PcSeriesSection({
  seriesList,
  maxLength,
}: PcSeriesSectionProps) {
  const seriesFilterLength = maxLength || seriesList.length;

  return (
    <div className="mobile:hidden">
      <section className="grid grid-cols-3 gap-5 tablet-only:grid-cols-2">
        {seriesList.slice(0, seriesFilterLength).map(([key, value], idx) => (
          <SeriesCard
            key={key}
            seriesKey={key}
            title={value.title}
            description={value.description}
            thumbnail={value.thumbnail}
            seriesCount={value.count}
            seriesIndex={idx}
          />
        ))}
      </section>
    </div>
  );
}

export interface SeriesSectionProps {
  seriesList: SeriesListType;
  maxLength?: number;
}

export function SeriesSection({ seriesList, maxLength }: SeriesSectionProps) {
  return (
    <>
      <MoSeriesSection seriesList={seriesList} maxLength={maxLength} />
      <PcSeriesSection seriesList={seriesList} maxLength={maxLength} />
    </>
  );
}
