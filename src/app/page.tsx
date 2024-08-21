import DefaultLayout from "@/layout/DefaultLayout";

export default function Home() {
  return (
    <DefaultLayout>
      <div className="h-full">
        <section className="flex flex-col items-center justify-center lg:text-3xl  xs:text-2xl pt-16 pb-20">
          <h2>안녕하세요</h2>
          <h2>을 추구하는</h2>
          <h2>개발자 김형석입니다.</h2>
        </section>

        <section className="flex flex-col items-center justify-center lg:text-3xl  xs:text-2xl">
          <h2>배우는 것에 즐거움을 느끼는</h2>
          <h2>프론트엔드 개발자입니다.</h2>
        </section>
      </div>
    </DefaultLayout>
  );
}
