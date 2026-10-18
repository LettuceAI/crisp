/** A local date for any year, including years before 100 that `new Date(y, m, d)` maps into the 1900s. */
export function calendarDate(year: number, month: number, day: number): Date {
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function daysInMonth(year: number, month: number): number {
  return calendarDate(year, month + 1, 0).getDate();
}
