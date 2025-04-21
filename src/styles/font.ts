import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    { path: "../fonts/Pretendard-Regular.woff2", weight: "400" },
    { path: "../fonts/Pretendard-Medium.woff2", weight: "500" },
    { path: "../fonts/Pretendard-Bold.woff2", weight: "700" },
  ],
  display: "swap",
});
