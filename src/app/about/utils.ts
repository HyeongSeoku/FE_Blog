import { FIRST_WORKED_DATE } from "@/constants/basic.constants";

export function getCareerYears(): number {
  const now = new Date();
  const diffYears =
    (now.getTime() - FIRST_WORKED_DATE.getTime()) /
    (365.25 * 24 * 60 * 60 * 1000);
  return Math.floor(diffYears) + 1;
}
