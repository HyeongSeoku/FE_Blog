"use client";

import { ElementType, ReactNode } from "react";
import classNames from "classnames";
import useAnimationVisibility from "@/hooks/useAnimationVisibility";
import { ANIMATE_FADE_IN_UP } from "@/constants/animation.constants";

export type AnimationNameType =
  | "animate-fadeInUp"
  | "animate-fadeInDown"
  | "animate-fadeInRight"
  | "animate-fadeInLeft";

interface AnimationContainerProps {
  htmlTag?: ElementType;
  animationName?: AnimationNameType;
  children: ReactNode;
  className?: string;
}

const AnimationContainer = ({
  htmlTag: HtmlTag = "div",
  animationName = ANIMATE_FADE_IN_UP,
  children,
  className,
  ...props
}: AnimationContainerProps) => {
  const [isVisible, ref] = useAnimationVisibility();

  return (
    <HtmlTag
      ref={ref}
      className={classNames(
        "opacity-0 transition duration-300 will-change-transform-opacity",
        {
          [animationName]: isVisible,
        },
        className,
      )}
      {...props}
    >
      {children}
    </HtmlTag>
  );
};

export default AnimationContainer;
