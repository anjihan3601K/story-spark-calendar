import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { CalendarGrid } from "@/components/CalendarGrid";
import { NotesPanel } from "@/components/NotesPanel";
import { useCalendarStore } from "@/hooks/use-calendar-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const store = useCalendarStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 py-4 md:px-6 md:py-8">
        {/* Wall Calendar Container */}
        <motion.div
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Hero Image */}
          <HeroSection currentMonth={store.currentMonth} />

          {/* Bottom section: Notes + Calendar */}
          <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
            {/* Notes sidebar */}
            <motion.div
              className="border-b border-border bg-surface-warm/50 p-4 md:p-5 lg:border-b-0 lg:border-r"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <NotesPanel
                notes={store.notes}
                currentMonth={store.currentMonth}
                direction={store.direction}
                selection={store.selection}
                onAddNote={store.addNote}
                onDeleteNote={store.deleteNote}
                onClearSelection={store.clearSelection}
              />
            </motion.div>

            {/* Calendar grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <CalendarGrid
                currentMonth={store.currentMonth}
                direction={store.direction}
                selection={store.selection}
                isSelecting={store.isSelecting}
                hoveredDate={store.hoveredDate}
                notes={store.notes}
                onPrevMonth={store.goToPrevMonth}
                onNextMonth={store.goToNextMonth}
                onToday={store.goToToday}
                onStartSelection={store.startSelection}
                onExtendSelection={store.extendSelection}
                onEndSelection={store.endSelection}
                onHover={store.setHoveredDate}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className="mt-6 text-center text-xs text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Drag across dates to select a range · Click to select a single day · Touch-friendly on mobile
        </motion.p>
      </div>
    </div>
  );
}
