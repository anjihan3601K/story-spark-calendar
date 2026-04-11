// US public holidays (month is 0-indexed)
interface Holiday {
  name: string;
  emoji: string;
  month: number;
  day: number;
}

const FIXED_HOLIDAYS: Holiday[] = [
  { name: "New Year's Day", emoji: "🎆", month: 0, day: 1 },
  { name: "Valentine's Day", emoji: "💕", month: 1, day: 14 },
  { name: "St. Patrick's Day", emoji: "☘️", month: 2, day: 17 },
  { name: "Independence Day", emoji: "🇺🇸", month: 6, day: 4 },
  { name: "Halloween", emoji: "🎃", month: 9, day: 31 },
  { name: "Veterans Day", emoji: "🎖️", month: 10, day: 11 },
  { name: "Christmas Eve", emoji: "🌟", month: 11, day: 24 },
  { name: "Christmas Day", emoji: "🎄", month: 11, day: 25 },
  { name: "New Year's Eve", emoji: "🥂", month: 11, day: 31 },
];

// Nth weekday of month helpers
function getNthWeekday(year: number, month: number, weekday: number, n: number): number {
  const first = new Date(year, month, 1);
  let day = 1 + ((weekday - first.getDay() + 7) % 7);
  day += (n - 1) * 7;
  return day;
}

function getLastWeekday(year: number, month: number, weekday: number): number {
  const last = new Date(year, month + 1, 0);
  const diff = (last.getDay() - weekday + 7) % 7;
  return last.getDate() - diff;
}

function getFloatingHolidays(year: number): Holiday[] {
  return [
    { name: "MLK Jr. Day", emoji: "✊", month: 0, day: getNthWeekday(year, 0, 1, 3) },
    { name: "Presidents' Day", emoji: "🏛️", month: 1, day: getNthWeekday(year, 1, 1, 3) },
    { name: "Mother's Day", emoji: "💐", month: 4, day: getNthWeekday(year, 4, 0, 2) },
    { name: "Memorial Day", emoji: "🇺🇸", month: 4, day: getLastWeekday(year, 4, 1) },
    { name: "Father's Day", emoji: "👔", month: 5, day: getNthWeekday(year, 5, 0, 3) },
    { name: "Labor Day", emoji: "⚒️", month: 8, day: getNthWeekday(year, 8, 1, 1) },
    { name: "Columbus Day", emoji: "🧭", month: 9, day: getNthWeekday(year, 9, 1, 2) },
    { name: "Thanksgiving", emoji: "🦃", month: 10, day: getNthWeekday(year, 10, 4, 4) },
  ];
}

export interface HolidayInfo {
  name: string;
  emoji: string;
}

export function getHolidaysForMonth(year: number, month: number): Map<number, HolidayInfo> {
  const map = new Map<number, HolidayInfo>();
  for (const h of FIXED_HOLIDAYS) {
    if (h.month === month) map.set(h.day, { name: h.name, emoji: h.emoji });
  }
  for (const h of getFloatingHolidays(year)) {
    if (h.month === month) map.set(h.day, { name: h.name, emoji: h.emoji });
  }
  return map;
}
