import { Locale } from "./i18n";

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  const dow = result.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  result.setDate(result.getDate() + diff);
  return result;
}

export function formatEventDate(
  isoDate: string,
  locale: Locale,
  lastWeekdayTemplate: string
): string {
  const [y, m, day] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisWeekStart = startOfWeek(today);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);

  if (date >= thisWeekStart) {
    return weekdayName;
  } else if (date >= lastWeekStart) {
    return lastWeekdayTemplate.replace("{day}", weekdayName);
  } else {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }
}
