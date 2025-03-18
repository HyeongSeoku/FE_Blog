"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <section className="w-full h-full px-8 md:px-4 flex flex-col">
      <div className="flex flex-col items-center gap-2 my-auto">
        <h1 className="text-3xl font-bold">404 Not found</h1>
        <h2 className="text-2xl">페이지를 찾을 수 없습니다</h2>

        <Link
          className="rounded-md bg-primary hover:bg-primary-hover py-2 px-3 trnasition-[background-color] duration-300 mt-5"
          href="/"
          replace
        >
          홈으로
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
