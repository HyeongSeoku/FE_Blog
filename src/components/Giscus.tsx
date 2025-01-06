"use client";

import useThemeStore from "@/store/theme";
import { useEffect, useRef } from "react";
import "@/styles/giscus.css";

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();

  // https://github.com/giscus/giscus/tree/main/styles/themes
  const theme = isDarkMode ? "noborder_gray" : "noborder_light";

  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "";
  const clientId = process.env.NEXT_PUBLIC_GISCUS_CLIENT_ID ?? "";
  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    scriptElem.setAttribute("data-repo", "HyeongSeoku/FE_Blog");
    scriptElem.setAttribute("data-repo-id", repoId);
    scriptElem.setAttribute("data-category", "Comments");
    scriptElem.setAttribute("data-category-id", clientId);
    scriptElem.setAttribute("data-mapping", "pathname");
    scriptElem.setAttribute("data-strict", "0");
    scriptElem.setAttribute("data-reactions-enabled", "1");
    scriptElem.setAttribute("data-emit-metadata", "0");
    scriptElem.setAttribute("data-input-position", "bottom");
    scriptElem.setAttribute("data-theme", theme);
    scriptElem.setAttribute("data-lang", "ko");
    scriptElem.setAttribute("crossorigin", "anonymous");

    ref.current.appendChild(scriptElem);
  }, [theme]);

  // https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#isetconfigmessage
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame",
    );
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app",
    );
  }, [theme]);

  return (
    <section ref={ref} className="giscusContainer mt-20" id="giscusSection" />
  );
}
