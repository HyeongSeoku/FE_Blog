import { SeriesMetadata } from "@/types/series";
import Link from "next/link";
import classNames from "classnames";
import Image from "next/image";

export interface SeriesCardProps extends SeriesMetadata {
  seriesKey: string;
  seriesCount: number;
  seriesIndex?: number; // 시리즈 순번 (SERIES 01, 02...)
  className?: string;
  isSelected?: boolean;
}

const DEFAULT_THUMBNAIL = "/image/default_img.png";

export default function SeriesCard({
  seriesKey,
  title,
  description,
  thumbnail,
  seriesCount,
  seriesIndex = 0,
  className = "",
}: SeriesCardProps) {
  const displayThumbnail = thumbnail || DEFAULT_THUMBNAIL;
  const seriesNumber = String(seriesIndex + 1).padStart(2, "0");

  return (
    <Link
      href={`/blog/series/${seriesKey}`}
      className={classNames(
        "group relative isolate flex flex-col h-[420px] rounded-3xl",
        "shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.12)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        "transition-shadow duration-500",
        className,
      )}
    >
      {/* 배경 이미지 컨테이너 - overflow 처리를 위한 별도 wrapper */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <Image
          src={displayThumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(min-width: 768px) 400px, 100vw"
        />
        {/* 그라데이션 오버레이 - hover 시 더 어두워짐 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 transition-opacity duration-500 group-hover:opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* 상단 뱃지 영역 */}
      <div className="relative z-10 flex justify-between items-start p-5">
        {/* 시리즈 번호 뱃지 */}
        <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase text-white/90 transition-all duration-300 group-hover:bg-black/50">
          Series {seriesNumber}
        </span>

        {/* 파트 수 */}
        <div className="text-right transition-transform duration-500 group-hover:-translate-y-1">
          <span className="block text-2xl font-light text-white/90 transition-colors duration-300 group-hover:text-white">
            {seriesCount}
          </span>
          <span className="text-[10px] font-medium tracking-wider uppercase text-white/60 transition-colors duration-300 group-hover:text-white/80">
            Parts
          </span>
        </div>
      </div>

      {/* 하단 콘텐츠 영역 - hover 시 위로 올라옴 */}
      <div className="relative z-10 mt-auto p-6 pt-8 transition-transform duration-500 ease-out group-hover:-translate-y-2">
        {/* 제목 */}
        <h3 className="text-2xl font-semibold text-white mb-3 leading-tight transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">
          {title}
        </h3>

        {/* 설명 */}
        {description && (
          <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-5 transition-colors duration-300 group-hover:text-white/90">
            {description}
          </p>
        )}

        {/* Read Series 링크 */}
        <span className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-white/60 transition-all duration-300 group-hover:text-white">
          Read Series
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
