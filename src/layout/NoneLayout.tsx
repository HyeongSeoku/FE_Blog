export interface NoneLayoutProps {
  children: React.ReactNode;
}

const NoneLayout = ({ children }: NoneLayoutProps) => {
  return <main className="w-full h-dvh flex flex-col">{children}</main>;
};

export default NoneLayout;
