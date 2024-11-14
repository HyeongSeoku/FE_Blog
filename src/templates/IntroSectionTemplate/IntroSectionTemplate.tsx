import SkillChip, { SkillName } from "@/components/SkillChip";
import { PUBLIC_IMG_PATH } from "@/constants/basic.constants";

const IntroSectionTemplate = () => {
  const SKILL_LIST: {
    skillName: SkillName;
    bgColor?: `#${string}`;
    imgSrc: string;
  }[] = [
    { skillName: "React", imgSrc: `${PUBLIC_IMG_PATH}/skill/react.svg` },
    {
      skillName: "TypeScript",
      imgSrc: `${PUBLIC_IMG_PATH}/skill/typescript.svg`,
    },
    {
      skillName: "NextJs",
      bgColor: "#363636",
      imgSrc: `${PUBLIC_IMG_PATH}/skill/nextjs.svg`,
    },
    {
      skillName: "JavaScript",
      imgSrc: `${PUBLIC_IMG_PATH}/skill/javascript.svg`,
    },
    { skillName: "HTML", imgSrc: `${PUBLIC_IMG_PATH}/skill/html5.svg` },
    { skillName: "CSS", imgSrc: `${PUBLIC_IMG_PATH}/skill/css3.svg` },
  ];

  return (
    <section className="mt-20 mb-16 flex flex-col items-center">
      <article className="text-3xl flex flex-col items-center font-bold gap-1">
        <h2>배우는것에 즐거움을 느끼는</h2>
        <h2 className="flex items-center gap-1">
          <div className="bg-primary box-border p-1 rounded-md">프론트엔드</div>
          개발자입니다.
        </h2>
      </article>
      <p className="flex justify-center mt-3 mb-5 text-sm text-center text-[var(--description-text-color)]">
        3년차 프론트엔드 개발자로 일하고 있습니다.
        <br /> 제가 느끼는 가치는.... 일할때는....
        <br /> 어떻게 되고 싶은...
      </p>
      <ul className="inline-flex flex-wrap gap-3 w-96 justify-center">
        {SKILL_LIST.map(({ skillName, bgColor, imgSrc }, idx) => (
          <SkillChip
            key={`${skillName}_${idx}`}
            skillName={skillName}
            backGroundColor={bgColor}
            imgSrc={imgSrc}
            index={idx + 1}
          />
        ))}
      </ul>
    </section>
  );
};

export default IntroSectionTemplate;
