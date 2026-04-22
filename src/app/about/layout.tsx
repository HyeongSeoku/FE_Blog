import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header headerType="DEFAULT" />
      <main className="flex-grow w-full flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
