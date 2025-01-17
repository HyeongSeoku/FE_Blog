import { hexToRgba } from "@/utils/styles";
import Image from "next/image";
import { useRef } from "react";

export interface SkillChipProps {
  imgSrc: string;
  skillName: SkillName;
  backGroundColor?: string;
  index: number;
  onClick: (title: string) => void;
}

export type SkillName =
  | "HTML"
  | "CSS"
  | "React"
  | "JavaScript"
  | "TypeScript"
  | "Next.js";

type SkillColor = {
  [key in SkillName]: string;
};

const skillColors: SkillColor = {
  HTML: "#E44D26",
  CSS: "#1172B8",
  React: "#53C1DE",
  JavaScript: "#FFCA27",
  TypeScript: "#3178C6",
  "Next.js": "#000000",
};

const SkillChip = ({
  skillName,
  imgSrc,
  backGroundColor,
  index,
  onClick,
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
      onClick={() => onClick(skillName)}
    >
      <Image width={18} height={18} src={imgSrc} alt={skillName} priority />
      <div className="font-semibold text-sm">{skillName}</div>
    </button>
  );
};

export default SkillChip;
