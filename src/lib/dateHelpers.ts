// Month-specific hero themes
export const MONTH_THEMES: Record<number, { gradient: string; accent: string; tagline: string }> = {
  0:  { gradient: "from-blue-900 via-slate-800 to-blue-700",     accent: "❄️", tagline: "New beginnings" },
  1:  { gradient: "from-rose-800 via-pink-700 to-rose-600",      accent: "💕", tagline: "Love is in the air" },
  2:  { gradient: "from-emerald-800 via-green-700 to-teal-600",  accent: "🌱", tagline: "Spring awakens" },
  3:  { gradient: "from-pink-700 via-rose-500 to-amber-400",     accent: "🌸", tagline: "Bloom & grow" },
  4:  { gradient: "from-green-700 via-emerald-500 to-lime-400",  accent: "🌿", tagline: "Life in full color" },
  5:  { gradient: "from-amber-600 via-orange-500 to-yellow-400", accent: "☀️", tagline: "Chase the sun" },
  6:  { gradient: "from-cyan-700 via-sky-500 to-blue-400",       accent: "🏖️", tagline: "Endless summer" },
  7:  { gradient: "from-orange-700 via-amber-500 to-yellow-400", accent: "🌻", tagline: "Golden days" },
  8:  { gradient: "from-amber-800 via-orange-600 to-red-500",    accent: "🍂", tagline: "Harvest time" },
  9:  { gradient: "from-orange-800 via-red-600 to-amber-500",    accent: "🎃", tagline: "Crisp & cozy" },
  10: { gradient: "from-slate-800 via-purple-700 to-indigo-600", accent: "🍁", tagline: "Gratitude season" },
  11: { gradient: "from-red-800 via-green-700 to-emerald-600",   accent: "🎄", tagline: "Season of joy" },
};

// Get date from touch event on calendar grid
export function getDateFromTouchEvent(
  e: TouchEvent,
  gridElement: HTMLElement | null
): Date | null {
  if (!gridElement) return null;
  const touch = e.touches[0];
  if (!touch) return null;
  
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!element) return null;
  
  const dateStr = element.closest("[data-date]")?.getAttribute("data-date");
  if (!dateStr) return null;
  
  return new Date(dateStr + "T00:00:00");
}
