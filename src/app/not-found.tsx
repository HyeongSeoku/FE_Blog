import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NotFound from "@/components/NotFound";
import NoneLayout from "@/layout/NoneLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEOK 개발블로그 | 페이지를 찾을 수 없습니다.",
  description: "페이지를 찾을 수 없습니다",
};

function Custom404() {
  return (
    <NoneLayout>
      <Header headerType="BACK" hideNavigation={true}></Header>
      <NotFound />
      <Footer />
    </NoneLayout>
  );
}

export default Custom404;
