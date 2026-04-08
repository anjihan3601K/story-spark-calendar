export type NoteColor = "peach" | "mint" | "lavender" | "sky" | "rose";

export interface CalendarNote {
  id: string;
  startDate: string; // ISO date string
  endDate: string;
  text: string;
  emoji: string;
  color: NoteColor;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const NOTE_COLORS: { value: NoteColor; label: string }[] = [
  { value: "peach", label: "Peach" },
  { value: "mint", label: "Mint" },
  { value: "lavender", label: "Lavender" },
  { value: "sky", label: "Sky" },
  { value: "rose", label: "Rose" },
];

export const EMOJIS = ["📝", "🎯", "💡", "🎉", "❤️", "⭐", "🔥", "🌿", "🎵", "📸", "✈️", "🏠"];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const d = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return d >= s && d <= e;
}

export function getRangeDays(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  return Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
