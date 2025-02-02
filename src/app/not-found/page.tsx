import NotFound from "@/components/NotFound";
import NoneLayout from "@/layout/NoneLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다.",
  description: "페이지를 찾을 수 없습니다",
};

export default function Custom404() {
  return (
    <NoneLayout>
      <NotFound />
    </NoneLayout>
  );
}
