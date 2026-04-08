import { isSameDay, isInRange } from "@/lib/calendar-types";
import type { CalendarNote, DateRange } from "@/lib/calendar-types";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  selection: DateRange;
  isSelecting: boolean;
  hoveredDate: Date | null;
  notes: CalendarNote[];
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: () => void;
}

export function DayCell({
  date,
  isCurrentMonth,
  isToday,
  selection,
  isSelecting,
  hoveredDate,
  notes,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: DayCellProps) {
  const effectiveEnd = isSelecting && hoveredDate ? hoveredDate : selection.end;
  const inRange = isInRange(date, selection.start, effectiveEnd);
  const isStart = selection.start && isSameDay(date, selection.start);
  const isEnd = effectiveEnd && isSameDay(date, effectiveEnd);
  const isHovered = hoveredDate && isSameDay(date, hoveredDate);

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const hasNotes = notes.some((n) => {
    const s = new Date(n.startDate + "T00:00:00");
    const e = new Date(n.endDate + "T00:00:00");
    return date >= s && date <= e;
  });

  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(date); }}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseUp={onMouseUp}
      className={`
        group relative flex h-10 w-full items-center justify-center rounded-lg
        text-sm font-medium transition-all duration-150 select-none
        ${!isCurrentMonth ? "text-muted-foreground/40" : "text-foreground"}
        ${isToday ? "ring-2 ring-calendar-today ring-offset-1 ring-offset-background" : ""}
        ${inRange && !isStart && !isEnd ? "bg-calendar-selection" : ""}
        ${isStart ? "bg-calendar-selection-start text-primary-foreground rounded-l-lg" : ""}
        ${isEnd ? "bg-calendar-selection-end text-primary-foreground rounded-r-lg" : ""}
        ${!inRange && isCurrentMonth ? "hover:bg-calendar-hover" : ""}
        ${isHovered && !inRange ? "bg-calendar-hover" : ""}
      `}
    >
      <span className="relative z-10">{date.getDate()}</span>
      {hasNotes && (
        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary opacity-60" />
      )}
    </button>
  );
}
