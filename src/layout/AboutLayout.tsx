import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface AboutLayout {
  children: ReactNode;
  structuredData?: object;
}

const AboutLayout = ({ children, structuredData }: AboutLayout) => {
  return (
    <div className="w-full h-auto min-h-fit flex flex-col flex-grow">
      <Header headerType="DEFAULT" />
      <main className="box-border w-full h-full min-h-fit flex flex-col flex-grow max-w-[1600px] mx-auto">
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

export default AboutLayout;
