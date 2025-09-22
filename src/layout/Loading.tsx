import LoadingLogo from "@/icon/loading_logo.svg";

const DefaultLoading = () => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <LoadingLogo width={100} />
      </div>

      <div className="fixed inset-0 z-40 bg-slate-400/40" />
    </>
  );
};
export default DefaultLoading;
