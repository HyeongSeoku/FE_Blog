import dayjs from "dayjs";

export interface GetDateParams {
  date?: string;
  format?: string;
}

export const getDate = ({ date, format = "YYYY/MM/DD" }: GetDateParams) => {
  const now = dayjs(date);
  console.log(now);
};
