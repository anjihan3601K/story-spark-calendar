import { useMemo } from "react";
import { motion } from "framer-motion";
import { getHolidaysForMonth } from "@/lib/holidays";

interface HolidayLegendProps {
  currentMonth: Date;
}

export function HolidayLegend({ currentMonth }: HolidayLegendProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const holidays = useMemo(() => {
    const map = getHolidaysForMonth(year, month);
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([day, info]) => ({ day, ...info }));
  }, [year, month]);

  if (holidays.length === 0) return null;

  const monthName = currentMonth.toLocaleString("en-IN", { month: "long" });

  return (
    <motion.div
      className="mt-4 rounded-xl border border-border bg-card p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        🎉 {monthName} Holidays
      </h3>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {holidays.map(({ day, name, emoji }, i) => (
          <motion.div
            key={`${month}-${day}`}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted/50"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.04 }}
          >
            <span className="text-base">{emoji}</span>
            <span className="font-medium text-foreground">{name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{day} {monthName.slice(0, 3)}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
