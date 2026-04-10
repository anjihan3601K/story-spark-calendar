import { motion } from "framer-motion";
import { isSameDay, isInRange, toISODateString } from "@/lib/calendar-types";
import type { CalendarNote, DateRange } from "@/lib/calendar-types";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  selection: DateRange;
  isSelecting: boolean;
  hoveredDate: Date | null;
  notes: CalendarNote[];
  isWeekend: boolean;
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
  isWeekend,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: DayCellProps) {
  const effectiveEnd = isSelecting && hoveredDate ? hoveredDate : selection.end;
  const inRange = isInRange(date, selection.start, effectiveEnd);
  const isStart = selection.start && isSameDay(date, selection.start);
  const isEnd = effectiveEnd && isSameDay(date, effectiveEnd);
  const isEndpoint = isStart || isEnd;

  const hasNotes = notes.some((n) => {
    const s = new Date(n.startDate + "T00:00:00");
    const e = new Date(n.endDate + "T00:00:00");
    return date >= s && date <= e;
  });

  // Determine range position for rounded corners
  const isRangeStart = isStart && !isEnd;
  const isRangeEnd = isEnd && !isStart;
  const isSingleDay = isStart && isEnd;

  const getClassName = () => {
    let base =
      "relative flex h-11 w-full items-center justify-center text-sm font-medium select-none cursor-pointer transition-all duration-150 md:h-12";

    if (!isCurrentMonth) {
      base += " text-muted-foreground/25 pointer-events-none";
    } else if (isWeekend) {
      base += " text-primary";
    } else {
      base += " text-foreground";
    }

    if (isSingleDay) {
      base += " bg-primary text-primary-foreground rounded-xl font-bold shadow-md";
    } else if (isRangeStart) {
      base += " bg-primary text-primary-foreground rounded-l-xl font-bold shadow-md";
    } else if (isRangeEnd) {
      base += " bg-primary text-primary-foreground rounded-r-xl font-bold shadow-md";
    } else if (inRange) {
      base += " bg-calendar-selection";
    }

    if (isToday && !isEndpoint) {
      base += " font-bold";
    }

    return base;
  };

  return (
    <motion.button
      type="button"
      data-date={toISODateString(date)}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(date);
      }}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseUp={onMouseUp}
      onTouchStart={(e) => {
        e.preventDefault();
        onMouseDown(date);
      }}
      className={getClassName()}
      whileHover={
        isCurrentMonth && !isEndpoint
          ? { scale: 1.18, backgroundColor: "var(--calendar-hover)" }
          : undefined
      }
      whileTap={isCurrentMonth ? { scale: 0.88 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
    >
      <span className="relative z-10">{date.getDate()}</span>

      {/* Today ring indicator */}
      {isToday && !isEndpoint && (
        <motion.span
          className="absolute inset-0.5 rounded-xl border-2 border-primary"
          layoutId="today-ring"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      {/* Selection glow effect */}
      {isEndpoint && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-primary/20 blur-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      )}

      {/* Note indicator dot */}
      {hasNotes && (
        <motion.span
          className={`absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isEndpoint ? "bg-primary-foreground" : "bg-primary"}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        />
      )}
    </motion.button>
  );
}
