"use client";

import { ElementType, ReactNode } from "react";
import classNames from "classnames";
import useAnimationVisibility from "@/hooks/useAnimationVisibility";
import { ANIMAITE_FADE_IN_UP } from "@/constants/animation.constants";

export type AnimationNameType =
  | "animate-fadeInUp"
  | "animate-fadeInDown"
  | "animate-fadeInRight"
  | "animate-fadeInLeft";

interface AnimationContainerProps {
  tag?: ElementType;
  animationName?: AnimationNameType;
  children: ReactNode;
  className?: string;
}

const AnimationContainer = ({
  tag: Tag = "div",
  animationName = ANIMAITE_FADE_IN_UP,
  children,
  className,
  ...props
}: AnimationContainerProps) => {
  const [isVisible, ref] = useAnimationVisibility();

  return (
    <Tag
      ref={ref}
      className={classNames(
        "opacity-0 transition duration-300",
        {
          [animationName]: isVisible,
        },
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default AnimationContainer;
