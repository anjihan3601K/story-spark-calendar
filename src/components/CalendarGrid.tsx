import { DayCell } from "@/components/DayCell";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { getDaysInMonth, getFirstDayOfMonth, isSameDay, getRangeDays, formatDate } from "@/lib/calendar-types";
import type { CalendarNote, DateRange } from "@/lib/calendar-types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentMonth: Date;
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

export function CalendarGrid({
  currentMonth,
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
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

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

  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6"
      onMouseLeave={() => onHover(null)}
    >
      <MonthSwitcher currentMonth={currentMonth} onPrev={onPrevMonth} onNext={onNextMonth} onToday={onToday} />

      {/* Selection tooltip */}
      {selection.start && rangeDays > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground animate-calendar-fade">
          <span className="font-medium">
            {formatDate(selection.start)}
            {selection.end && !isSameDay(selection.start, selection.end) && ` → ${formatDate(effectiveEnd!)}`}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-semibold">
            {rangeDays} day{rangeDays > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Weekday headers */}
      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 animate-calendar-fade">
        {cells.map(({ date, isCurrentMonth }) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            isCurrentMonth={isCurrentMonth}
            isToday={isSameDay(date, today)}
            selection={selection}
            isSelecting={isSelecting}
            hoveredDate={hoveredDate}
            notes={notes}
            onMouseDown={onStartSelection}
            onMouseEnter={(d) => {
              onHover(d);
              onExtendSelection(d);
            }}
            onMouseUp={onEndSelection}
          />
        ))}
      </div>
    </div>
  );
}
