import { usePathname } from "next/navigation";

const useIssueInfo = () => {
  const pathname = usePathname();

  return {
    title: `Issue path: ${pathname}`,
    body: `Describe the issue on this page: ${pathname}`,
  };
};

export default useIssueInfo;
