import Link from "next/link";
import ThemeButton from "@/components/ThemeButton/ThemeButton";

/** 포트폴리오/소개 페이지에서 공유하는 최소 헤더 — 뒤로가기 링크 + 테마 토글만 표시 */
const MinimalHeader = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-theme">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-6 tablet:px-10">
        <Link
          href="/"
          className="text-meta text-muted transition-opacity hover:opacity-[.55]"
        >
          ← sseoku.com
        </Link>
        <ThemeButton />
      </div>
    </header>
  );
};

export default MinimalHeader;
