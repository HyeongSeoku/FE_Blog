"use client";

import { SeriesResponse } from "@/types/series";
import SeriesCard from "@/components/SeriesCard";
import { SwiperComponent } from "@/components/SwiperComponent";
import { SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState } from "react";
import classNames from "classnames";

type SeriesListType = [string, SeriesResponse][];

interface MoSeriesSectionProps {
  seriesList: SeriesListType;
}

function MoSeriesSection({ seriesList }: MoSeriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="overflow-hidden py-4 min-md:hidden">
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
              isSelected={idx === activeIndex}
            />
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </section>
  );
}

interface PcSeriesSectionProps {
  seriesList: SeriesListType;
}

function PcSeriesSection({ seriesList }: PcSeriesSectionProps) {
  return (
    <section className="md:hidden grid grid-cols-4 gap-3">
      {seriesList.slice(0, 4).map(([key, value]) => (
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
  );
}

export interface SeriesSectionProps {
  seriesList: SeriesListType;
}

export function SeriesSection({ seriesList }: SeriesSectionProps) {
  return (
    <>
      <MoSeriesSection seriesList={seriesList} />
      <PcSeriesSection seriesList={seriesList} />
    </>
  );
}
