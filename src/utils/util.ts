import { FIRST_WORKED_DATE } from "@/constants/basic.constants";

export const isSafari = (userAgent?: string) => {
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /^((?!chrome|android).)*safari/i.test(ua);
};

export const issueUrl = (title: string, body: string) => {
  return `title=${encodeURIComponent(
    `${title}`,
  )}&body=${encodeURIComponent(`${body}`)}`;
};

export const getYearsWorked = (): number => {
  const now = new Date();

  let years = now.getFullYear() - FIRST_WORKED_DATE.getFullYear();

  if (
    now.getMonth() < FIRST_WORKED_DATE.getMonth() ||
    (now.getMonth() === FIRST_WORKED_DATE.getMonth() &&
      now.getDate() < FIRST_WORKED_DATE.getDate())
  ) {
    years--;
  }

  return years + 1;
};
