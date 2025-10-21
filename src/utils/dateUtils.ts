import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';

const TIMEZONE = 'Europe/Berlin';

export function getCurrentDate(): Date {
  const now = new Date();
  return utcToZonedTime(now, TIMEZONE);
}

export function getCurrentDay(): number {
  const berlinDate = getCurrentDate();
  return berlinDate.getDate();
}

export function getCurrentMonth(): number {
  const berlinDate = getCurrentDate();
  return berlinDate.getMonth() + 1; // 1-based
}

export function isDoorUnlocked(day: number, previewMode: boolean = false): boolean {
  if (previewMode) return true;
  
  const currentMonth = getCurrentMonth();
  const currentDay = getCurrentDay();
  
  // Only unlock in December
  if (currentMonth !== 12) return false;
  
  return day <= currentDay;
}

export function formatDate(date: Date): string {
  return format(utcToZonedTime(date, TIMEZONE), 'dd.MM.yyyy', { timeZone: TIMEZONE });
}
