import { createFileRoute } from "@tanstack/react-router";
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
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {/* Hero */}
        <div className="animate-slide-up">
          <HeroSection />
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-6 md:mt-8 lg:grid-cols-[1fr_380px]">
          {/* Calendar */}
          <div className="animate-slide-up [animation-delay:100ms] [animation-fill-mode:backwards]">
            <CalendarGrid
              currentMonth={store.currentMonth}
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

          {/* Notes */}
          <div className="animate-slide-up [animation-delay:200ms] [animation-fill-mode:backwards]">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
              <NotesPanel
                notes={store.notes}
                selection={store.selection}
                onAddNote={store.addNote}
                onDeleteNote={store.deleteNote}
                onClearSelection={store.clearSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
