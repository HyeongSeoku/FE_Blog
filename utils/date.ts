import dayjs from "dayjs";

export const getDate = (format: string = "YYYY/MM/DD", date?: string) => {
  const now = dayjs(date);
  return now.format(format);
};
