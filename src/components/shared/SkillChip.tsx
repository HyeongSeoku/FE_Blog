import Image from "next/image";
import { useRef } from "react";

export interface SkillChipProps {
  imgSrc: string;
  skillName: SkillName;
  backGroundColor?: string;
  index: number;
}

export type SkillName =
  | "HTML"
  | "CSS"
  | "React"
  | "JavaScript"
  | "TypeScript"
  | "NextJs";

type SkillColor = {
  [key in SkillName]: string;
};

const skillColors: SkillColor = {
  HTML: "#E44D26",
  CSS: "#1172B8",
  React: "#53C1DE",
  JavaScript: "#FFCA27",
  TypeScript: "#3178C6",
  NextJs: "#000000",
};

const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity}%)`;
};

const SkillChip = ({
  skillName,
  imgSrc,
  backGroundColor,
  index,
}: SkillChipProps) => {
  const chipRef = useRef<HTMLButtonElement>(null);

  const handleAnimationEnd = () => {
    if (chipRef.current) {
      chipRef.current.classList.remove("animate-bounceJelly");
    }
  };

  return (
    <button
      ref={chipRef}
      className="flex items-center gap-1 w-fit py-1 px-2 rounded-md animate-bounceJelly transform duration-300 hover:scale-110"
      style={{
        backgroundColor: hexToRgba(
          backGroundColor || skillColors[skillName],
          40,
        ),
        color: skillColors[skillName],
        animationDelay: `${index * 0.1}s`,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      <Image width={20} height={20} src={imgSrc} alt={skillName} />
      <div className="font-semibold">{skillName}</div>
    </button>
  );
};

export default SkillChip;
