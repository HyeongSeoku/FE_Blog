import type { Metadata } from "next";
import NotFound from "@/components/NotFound";
import DefaultLayout from "@/layout/DefaultLayout";

export const metadata: Metadata = {
  title: "SEOK 개발블로그 | 페이지를 찾을 수 없습니다.",
  description: "페이지를 찾을 수 없습니다",
};

function Custom404() {
  return (
    <DefaultLayout>
      <NotFound />
    </DefaultLayout>
  );
}

export default Custom404;
