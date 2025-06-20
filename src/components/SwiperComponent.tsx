"use client";

import { Swiper } from "swiper/react";
import type { SwiperProps } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

interface SwiperComponentProps extends SwiperProps {
  children: React.ReactNode;
  className?: string;
}

export function SwiperComponent({
  children,
  className,
  ...restProps
}: SwiperComponentProps) {
  return (
    <Swiper {...restProps} className={`!overflow-visible ${className ?? ""}`}>
      {children}
    </Swiper>
  );
}
