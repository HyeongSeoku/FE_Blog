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

export const formatToKoreanMonth = (date: string): string => {
  if (!date) return "Invalid Date";

  const isFullDate = /^\d{4}\.\d{2}\.\d{2}$/.test(date);
  let normalizedDate = date;

  if (!isFullDate && /^\d{4}\.\d{2}$/.test(date)) {
    normalizedDate += ".01";
  }

  const parsedDate = dayjs(normalizedDate, "YYYY.MM.DD");

  if (!parsedDate.isValid()) {
    console.error("⚠️ Invalid Date detected:", date);
    return "Invalid Date";
  }

  return parsedDate.format("YYYY년MM월");
};
