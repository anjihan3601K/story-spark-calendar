import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/NoteCard";
import { NOTE_COLORS, EMOJIS, formatDate, toISODateString, getRangeDays } from "@/lib/calendar-types";
import type { CalendarNote, DateRange, NoteColor } from "@/lib/calendar-types";

interface NotesPanelProps {
  notes: CalendarNote[];
  currentMonth: Date;
  direction: 1 | -1;
  selection: DateRange;
  onAddNote: (note: Omit<CalendarNote, "id">) => void;
  onDeleteNote: (id: string) => void;
  onClearSelection: () => void;
}

export function NotesPanel({ notes, currentMonth, direction, selection, onAddNote, onDeleteNote, onClearSelection }: NotesPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [color, setColor] = useState<NoteColor>("peach");

  const hasSelection = selection.start && selection.end;
  const rangeDays = getRangeDays(selection.start, selection.end);

  const handleSubmit = () => {
    if (!text.trim() || !selection.start || !selection.end) return;
    const start = selection.start < selection.end ? selection.start : selection.end;
    const end = selection.start < selection.end ? selection.end : selection.start;
    onAddNote({
      startDate: toISODateString(start),
      endDate: toISODateString(end),
      text: text.trim(),
      emoji,
      color,
    });
    setText("");
    setEmoji("📝");
    setColor("peach");
    setIsAdding(false);
    onClearSelection();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthKey = `${year}-${month}`;

  // Filter notes that overlap with the current month
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const monthNotes = notes.filter((note) => {
    const nStart = new Date(note.startDate);
    const nEnd = new Date(note.endDate);
    return nStart <= monthEnd && nEnd >= monthStart;
  });

  const sortedNotes = [...monthNotes].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="h-4 w-4 text-primary" />
          </motion.div>
          <h3 className="text-base font-bold uppercase tracking-tight text-foreground">Memories</h3>
        </div>
        <motion.span
          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
          key={monthNotes.length + monthKey}
          initial={{ scale: 1.4, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          {monthNotes.length}
        </motion.span>
      </div>

      {/* Empty state — ruled lines (only when no notes globally) */}
      {!hasSelection && !isAdding && notes.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="border-b border-muted-foreground/10 py-3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          ))}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4 text-center text-xs text-muted-foreground/50"
          >
            Select dates to create memories ✨
          </motion.p>
        </motion.div>
      )}

      {/* Smart prompt — "Add note for this range?" */}
      <AnimatePresence>
        {hasSelection && !isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <motion.div
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              <span>
                {rangeDays} day{rangeDays > 1 ? "s" : ""} selected — add a memory?
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(selection.start!)}
              {rangeDays > 1 && ` → ${formatDate(selection.end!)}`}
            </p>
            <div className="mt-3 flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}>
                <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1.5 rounded-full text-xs font-semibold">
                  <Plus className="h-3.5 w-3.5" />
                  Add Memory
                </Button>
              </motion.div>
              <Button size="sm" variant="ghost" onClick={onClearSelection} className="rounded-full text-xs">
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add note form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-md"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's the memory?"
              className="w-full resize-none rounded-lg border-0 bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={3}
              autoFocus
            />

            {/* Emoji picker */}
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Emoji</p>
              <div className="flex flex-wrap gap-1">
                {EMOJIS.map((e) => (
                  <motion.button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    whileHover={{ scale: 1.25, rotate: 10 }}
                    whileTap={{ scale: 0.8 }}
                    className={`rounded-lg p-1.5 text-lg transition-colors ${emoji === e ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-secondary"}`}
                  >
                    {e}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Color</p>
              <div className="flex gap-2">
                {NOTE_COLORS.map((c) => {
                  const bgMap: Record<string, string> = {
                    peach: "bg-note-peach",
                    mint: "bg-note-mint",
                    lavender: "bg-note-lavender",
                    sky: "bg-note-sky",
                    rose: "bg-note-rose",
                  };
                  return (
                    <motion.button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.85 }}
                      className={`h-7 w-7 rounded-full ${bgMap[c.value]} transition-shadow ${color === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                      title={c.label}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" onClick={handleSubmit} disabled={!text.trim()} className="rounded-full text-xs font-semibold">
                  Save Memory
                </Button>
              </motion.div>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-full text-xs">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      <div className="space-y-3">
        {sortedNotes.length === 0 && !hasSelection && !isAdding && (
          <p className="py-6 text-center text-xs text-muted-foreground/50">
            No memories for {monthLabel} yet ✨
          </p>
        )}
        {sortedNotes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <NoteCard note={note} onDelete={onDeleteNote} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
