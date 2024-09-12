import dayjs from "dayjs";

export const getDate = (format: string = "YYYY/MM/DD", date?: string) => {
  const now = date ? dayjs(date, "YYYYMMDD") : dayjs();
  return now.format(format);
};
