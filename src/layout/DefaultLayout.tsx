import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header, { type HeaderType } from "@/components/Header";

export interface DefaultLayoutProps {
  children: ReactNode;
  headerType?: HeaderType;
  structuredData?: object;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
  structuredData,
}: DefaultLayoutProps) => {
  return (
    <div className="w-full h-auto min-h-fit flex flex-col flex-grow">
      <Header headerType={headerType} />
      <main className="mx-auto box-border flex w-full max-w-[680px] flex-grow flex-col px-5 pt-section">
        {children}
      </main>
      <Footer />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </div>
  );
};

export default DefaultLayout;
