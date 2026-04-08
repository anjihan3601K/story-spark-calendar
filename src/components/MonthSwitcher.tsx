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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onPrev} className="h-9 w-9 rounded-xl hover:bg-secondary">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="min-w-[160px] text-center text-lg font-semibold tracking-tight text-foreground">
          {monthName}
        </h2>
        <Button variant="ghost" size="icon" onClick={onNext} className="h-9 w-9 rounded-xl hover:bg-secondary">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="outline" size="sm" onClick={onToday} className="gap-1.5 rounded-xl text-xs">
        <CalendarDays className="h-3.5 w-3.5" />
        Today
      </Button>
    </div>
  );
}
