import { useRouter } from "next/router";

const useCurrentPageInfo = () => {
  const router = useRouter();
  const currentPath = router.asPath;

  return {
    title: `Issue for: ${currentPath}`,
    body: `Describe the issue on this page: ${currentPath}`,
  };
};

export default useCurrentPageInfo;
