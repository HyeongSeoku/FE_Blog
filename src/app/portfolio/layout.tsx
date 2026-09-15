import type { ReactNode } from "react";
import MinimalHeader from "@/components/MinimalHeader";

const PortfolioLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <MinimalHeader />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 pb-24 tablet:px-10">
        {children}
      </main>
    </div>
  );
};

export default PortfolioLayout;
