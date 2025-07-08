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

  return (
    <section className="overflow-hidden py-4 min-md:hidden">
      <SwiperComponent
        modules={[Navigation]}
        spaceBetween={4}
        slidesPerView="auto"
        centeredSlides={true}
        initialSlide={1}
        // loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {seriesList.map(([key, value], idx) => (
          <SwiperSlide key={key} style={{ width: 280 }}>
            <SeriesCard
              seriesKey={key}
              title={value.title}
              description={value.description}
              thumbnail={value.thumbnail}
              seriesCount={value.count}
              className={classNames(
                "transition-transform",
                idx === activeIndex ? "scale-100" : "scale-90",
              )}
              isSelected={idx === activeIndex}
            />
          </SwiperSlide>
        ))}
        {showMoreBtn && (
          <SwiperSlide style={{ width: 280, height: "100%" }}>
            <div className="flex items-center mt-4 ">
              <Link
                className={classNames(
                  "px-4 py-2 rounded-md mx-auto transition-colors duration-300",
                  "bg-gray-400 hover:bg-gray-300",
                  "dark:bg-gray-600 dark:hover:bg-gray-500",
                )}
                href={"/series"}
              >
                전체 시리즈 보기
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
  const showMoreBtn = !!maxLength && seriesList.length > maxLength;
  const seriesFilterLength = maxLength || seriesList.length;

  return (
    <div className="md:hidden group">
      <section className="grid grid-cols-4 gap-3 md-lg:grid-cols-2">
        {seriesList.slice(0, seriesFilterLength).map(([key, value]) => (
          <SeriesCard
            key={key}
            seriesKey={key}
            title={value.title}
            description={value.description}
            thumbnail={value.thumbnail}
            seriesCount={value.count}
          />
        ))}
      </section>
      {showMoreBtn && (
        <div className="flex items-center mt-4">
          <Link
            className={classNames(
              "px-4 py-2 rounded-md mx-auto transition-colors duration-300",
              "bg-gray-400 hover:bg-gray-300",
              "dark:bg-gray-600 dark:hover:bg-gray-500",
            )}
            href={"/series"}
          >
            전체 시리즈 보기
          </Link>
        </div>
      )}
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
