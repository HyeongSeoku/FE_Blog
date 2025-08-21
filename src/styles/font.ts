import localFont from "next/font/local";

export const pretendard = localFont({
  src: [{ path: "../fonts/PretendardVariable.woff2", style: "normal" }],
  weight: "100 900",
  display: "swap",
  variable: "--font-pretendard",
});
