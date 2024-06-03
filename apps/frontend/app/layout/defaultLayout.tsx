import Header from "~/components/shared/header";

export interface DefaultLayoutProps {
  children: React.ReactNode;
  headerType?: string;
}

const DefaultLayout = ({
  children,
  headerType = "DEFAULT",
}: DefaultLayoutProps) => {
  return (
    <>
      <Header headerType={headerType}></Header>
      <>{children}</>
    </>
  );
};

export default DefaultLayout;
