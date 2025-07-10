"use client";

import Image, { ImageProps, StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import DefaultImg from "@/icon/default_img.svg";

export interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src: string | StaticImageData;
  fallbackSrc?: string | StaticImageData;
}

export default function FallbackImage({
  src,
  fallbackSrc,
  alt,
  className = "",
  ...rest
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | StaticImageData | null>(
    src,
  );
  const [errorStage, setErrorStage] = useState<
    "initial" | "fallback" | "default"
  >("initial");

  useEffect(() => {
    setCurrentSrc(src);
    setErrorStage("initial");
  }, [src]);

  const handleError = () => {
    if (errorStage === "initial" && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setErrorStage("fallback");
    } else {
      setCurrentSrc(null); // 최종 fallback
      setErrorStage("default");
    }
  };

  if (currentSrc) {
    return (
      <Image
        {...rest}
        className={className}
        src={currentSrc || ""}
        alt={alt}
        onError={handleError}
      />
    );
  }

  return <DefaultImg className={className} aria-label={alt} />;
}
