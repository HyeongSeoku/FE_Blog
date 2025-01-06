import { MOBILE_WIDTH } from "@/constants/basic.constants";
import useDeviceStore from "@/store/deviceType";
import { useEffect } from "react";

function useDeviceType() {
  const { setIsMobile } = useDeviceStore();

  useEffect(() => {
    const checkDeviceWidth = () => {
      setIsMobile(window.innerWidth <= MOBILE_WIDTH);
    };

    checkDeviceWidth();

    window.addEventListener("resize", checkDeviceWidth);

    return () => {
      window.removeEventListener("resize", checkDeviceWidth);
    };
  }, [setIsMobile]);
}

export default useDeviceType;
