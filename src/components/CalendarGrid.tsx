import { useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayCell } from "@/components/DayCell";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { getDaysInMonth, isSameDay, getRangeDays, formatDate } from "@/lib/calendar-types";
import { getDateFromTouchEvent } from "@/lib/dateHelpers";
import { getHolidaysForMonth } from "@/lib/holidays";
import type { CalendarNote, DateRange } from "@/lib/calendar-types";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface CalendarGridProps {
  currentMonth: Date;
  direction: 1 | -1;
  selection: DateRange;
  isSelecting: boolean;
  hoveredDate: Date | null;
  notes: CalendarNote[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onStartSelection: (date: Date) => void;
  onExtendSelection: (date: Date) => void;
  onEndSelection: () => void;
  onHover: (date: Date | null) => void;
}

function getMondayFirstDay(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function CalendarGrid({
  currentMonth,
  direction,
  selection,
  isSelecting,
  hoveredDate,
  notes,
  onPrevMonth,
  onNextMonth,
  onToday,
  onStartSelection,
  onExtendSelection,
  onEndSelection,
  onHover,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getMondayFirstDay(year, month);
  const today = new Date();
  const holidays = useMemo(() => getHolidaysForMonth(year, month), [year, month]);

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  const effectiveEnd = isSelecting && hoveredDate ? hoveredDate : selection.end;
  const rangeDays = getRangeDays(selection.start, effectiveEnd);
  

  // Touch drag handler
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const date = getDateFromTouchEvent(e.nativeEvent, gridRef.current);
      if (date) {
        onExtendSelection(date);
        onHover(date);
      }
    },
    [onExtendSelection, onHover]
  );

  return (
    <div className="p-4 md:p-6" onMouseLeave={() => onHover(null)}>
      <MonthSwitcher currentMonth={currentMonth} onPrev={onPrevMonth} onNext={onNextMonth} onToday={onToday} />

      {/* Selection info tooltip */}
      <AnimatePresence>
        {selection.start && rangeDays > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
              <span className="font-semibold text-primary">
                {formatDate(selection.start)}
                {selection.end && !isSameDay(selection.start, selection.end) && ` → ${formatDate(effectiveEnd!)}`}
              </span>
              <motion.span
                className="rounded-full bg-primary px-2 py-0.5 font-bold text-primary-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {rangeDays} day{rangeDays > 1 ? "s" : ""} selected — add a memory?
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekday headers */}
      <div className="mt-4 grid grid-cols-7 gap-0 border-b border-border pb-2">
        {WEEKDAYS.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`text-center text-xs font-bold tracking-wider ${i >= 5 ? "text-primary" : "text-muted-foreground"}`}
          >
            {d}
          </motion.div>
        ))}
      </div>

      {/* Day cells grid */}
      <div
        ref={gridRef}
        className="mt-1 grid grid-cols-7 gap-0"
        onTouchMove={handleTouchMove}
        onTouchEnd={onEndSelection}
      >
        {cells.map(({ date, isCurrentMonth }, idx) => {
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          return (
            <DayCell
              key={date.toISOString()}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isSameDay(date, today)}
              selection={selection}
              isSelecting={isSelecting}
              hoveredDate={hoveredDate}
              notes={notes}
              isWeekend={isWeekend}
              holiday={isCurrentMonth ? holidays.get(date.getDate()) : undefined}
              onMouseDown={onStartSelection}
              onMouseEnter={(d) => {
                onHover(d);
                onExtendSelection(d);
              }}
              onMouseUp={onEndSelection}
            />
          );
        })}
      </div>
    </div>
  );
}
