import { MOBILE_WIDTH } from "@/constants/basic.constants";
import useDeviceStore from "@/store/deviceType";
import { useEffect } from "react";

function useDetectResize() {
  const { setIsMobile } = useDeviceStore();

  useEffect(() => {
    setIsMobile(window.innerWidth <= MOBILE_WIDTH);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_WIDTH);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsMobile]);
}

export default useDetectResize;
