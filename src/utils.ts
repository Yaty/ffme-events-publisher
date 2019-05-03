function getDateDiffInDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDateDiffInDaysFromNow(date: Date): number {
  return getDateDiffInDays(new Date(), date);
}

export function getTheEndOfTheDayDate(date: number, month: number, year: number): Date {
  return new Date(year, month - 1, date, 23, 59, 59, 9999);
}
