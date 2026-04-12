import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { CalendarGrid } from "@/components/CalendarGrid";
import { NotesPanel } from "@/components/NotesPanel";
import { useCalendarStore } from "@/hooks/use-calendar-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const store = useCalendarStore();
  const year = store.currentMonth.getFullYear();
  const month = store.currentMonth.getMonth();
  const monthKey = `${year}-${month}`;

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

          {/* Bottom section: Notes + Calendar — flips as one unit */}
          <div style={{ perspective: "1200px" }}>
            <AnimatePresence mode="wait" custom={store.direction}>
              <motion.div
                key={monthKey}
                custom={store.direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={{
                  enter: (dir: number) => ({
                    rotateX: dir > 0 ? -90 : 90,
                    opacity: 0,
                    transformOrigin: dir > 0 ? "bottom center" : "top center",
                  }),
                  center: {
                    rotateX: 0,
                    opacity: 1,
                    transformOrigin: "center center",
                  },
                  exit: (dir: number) => ({
                    rotateX: dir > 0 ? 90 : -90,
                    opacity: 0,
                    transformOrigin: dir > 0 ? "top center" : "bottom center",
                  }),
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-0 lg:grid-cols-[280px_1fr]"
              >
                {/* Notes sidebar */}
                <div className="border-b border-border bg-surface-warm/50 p-4 md:p-5 lg:border-b-0 lg:border-r">
                  <NotesPanel
                    notes={store.notes}
                    currentMonth={store.currentMonth}
                    direction={store.direction}
                    selection={store.selection}
                    onAddNote={store.addNote}
                    onDeleteNote={store.deleteNote}
                    onClearSelection={store.clearSelection}
                  />
                </div>

                {/* Calendar grid */}
                <div>
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
                </div>
              </motion.div>
            </AnimatePresence>
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
