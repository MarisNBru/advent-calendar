import { utcToZonedTime, format } from 'date-fns-tz';

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

export function isDoorUnlocked(_day: number, _previewMode: boolean = false): boolean {
  // All doors are always unlocked, regardless of date or preview mode
  return true;
}

export function formatDate(date: Date): string {
  return format(utcToZonedTime(date, TIMEZONE), 'dd.MM.yyyy', { timeZone: TIMEZONE });
}
