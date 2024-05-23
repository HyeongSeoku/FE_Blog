import Header from "~/components/shared/header";

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Header></Header>
      <>{children}</>
    </>
  );
};

export default DefaultLayout;
