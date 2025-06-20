"use client";

import { SeriesResponse } from "@/types/series";
import SeriesCard from "@/components/SeriesCard";
import { SwiperComponent } from "@/components/SwiperComponent";
import { SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState } from "react";
import classNames from "classnames";

export interface SeriesSectionProps {
  seriesList: [string, SeriesResponse][];
}

export function SeriesSection({ seriesList }: SeriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="overflow-hidden">
      <SwiperComponent
        modules={[Navigation]}
        spaceBetween={4}
        slidesPerView="auto"
        centeredSlides={true}
        initialSlide={1}
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
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
}
