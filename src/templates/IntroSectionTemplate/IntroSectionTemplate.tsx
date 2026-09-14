import { getYearsWorked } from "@/utils/util";

const IntroSectionTemplate = () => {
  const workedYear = getYearsWorked();

  return (
    <>
      <section className="flex flex-col gap-2">
        <h1 className="text-hero-name font-bold text-theme">김형석</h1>
        <p className="text-[15px] text-muted">
          {workedYear}년차 프론트엔드 개발자
        </p>
      </section>

      <section className="mt-stack flex flex-col gap-4">
        <h2 className="text-label text-muted">소개</h2>
        <p className="text-body leading-[var(--line-intro)] text-theme">
          웹에서 사람이 실제로 겪는 문제를 코드로 좁히는 일을 합니다. 화면이
          느리게 뜨는 이유, 영상이 끊기는 지점, 디자인과 구현이 어긋나는 자리를
          끝까지 따라가 원인을 찾고 고치는 과정을 좋아합니다.
        </p>
        <p className="text-body leading-[var(--line-intro)] text-muted">
          여기에는 그 과정에서 남은 기록을 정리합니다. 디버깅하며 알게 된
          브라우저 내부 동작, 디자인 시스템을 만들며 내린 결정, 오픈소스에
          기여하며 배운 것들. 대체로 결론보다 거기까지 간 경로를 적습니다.
        </p>
      </section>
    </>
  );
};

export default IntroSectionTemplate;
