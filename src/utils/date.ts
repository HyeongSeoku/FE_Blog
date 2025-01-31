import dayjs from "dayjs";
import { isSafari } from "./util";

export const getDate = (
  format: string = "YYYY/MM/DD",
  date?: string,
  userAgent?: string,
) => {
  if (!date) return dayjs().format(format);
  const safariDetected = isSafari(userAgent);

  const normalizedDate = safariDetected ? date.replace(/\./g, "-") : date;

  const now = dayjs(normalizedDate, "YYYY-MM-DD");

  if (!now.isValid()) {
    console.error("⚠️ Invalid Date detected:", date);
    return "Invalid Date";
  }

  return now.format(format);
};
