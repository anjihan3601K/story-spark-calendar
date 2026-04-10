import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSwitcherProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function MonthSwitcher({ currentMonth, onPrev, onNext, onToday }: MonthSwitcherProps) {
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <motion.div whileHover={{ scale: 1.15, x: -2 }} whileTap={{ scale: 0.85 }}>
          <Button variant="ghost" size="icon" onClick={onPrev} className="h-9 w-9 rounded-full hover:bg-primary/10">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </motion.div>
        <div className="min-w-[180px] overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={monthName}
              initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg font-bold tracking-tight text-foreground"
            >
              {monthName}
            </motion.h2>
          </AnimatePresence>
        </div>
        <motion.div whileHover={{ scale: 1.15, x: 2 }} whileTap={{ scale: 0.85 }}>
          <Button variant="ghost" size="icon" onClick={onNext} className="h-9 w-9 rounded-full hover:bg-primary/10">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="gap-1.5 rounded-full border-primary/30 text-xs font-semibold hover:bg-primary/10 hover:text-primary"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          Today
        </Button>
      </motion.div>
    </div>
  );
}
