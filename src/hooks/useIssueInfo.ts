import { usePathname } from "next/navigation";
import { useMemo } from "react";

const useIssueInfo = () => {
  const pathname = usePathname();

  return useMemo(
    () => ({
      title: `Issue path: ${pathname}`,
      body: `Describe the issue on this page: ${pathname}`,
    }),
    [pathname],
  );
};

export default useIssueInfo;
