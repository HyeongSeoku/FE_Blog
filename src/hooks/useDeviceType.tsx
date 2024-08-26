import { MOBILE_WIDTH } from "@/constants/device.constants";
import useDeviceStore from "@/store/deviceType";
import { useEffect } from "react";

function useDeviceType() {
  const { setIsMobile } = useDeviceStore();

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth <= MOBILE_WIDTH);
    };

    checkDeviceType();

    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, [setIsMobile]);
}

export default useDeviceType;
