import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import MinimalHeader from "@/components/MinimalHeader";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <MinimalHeader />
      <main className="flex-grow w-full flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
