import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/NoteCard";
import { NOTE_COLORS, EMOJIS, formatDate, toISODateString, getRangeDays } from "@/lib/calendar-types";
import type { CalendarNote, DateRange, NoteColor } from "@/lib/calendar-types";

interface NotesPanelProps {
  notes: CalendarNote[];
  selection: DateRange;
  onAddNote: (note: Omit<CalendarNote, "id">) => void;
  onDeleteNote: (id: string) => void;
  onClearSelection: () => void;
}

export function NotesPanel({ notes, selection, onAddNote, onDeleteNote, onClearSelection }: NotesPanelProps) {
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

  const sortedNotes = [...notes].sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Notes</h3>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {notes.length}
        </span>
      </div>

      {/* Smart prompt */}
      {hasSelection && !isAdding && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-card-enter">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Add note for {formatDate(selection.start!)}
            {rangeDays > 1 && ` → ${formatDate(selection.end!)}`}?
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1.5 rounded-xl text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add Note
            </Button>
            <Button size="sm" variant="ghost" onClick={onClearSelection} className="rounded-xl text-xs">
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Add note form */}
      {isAdding && (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm animate-card-enter">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="w-full resize-none rounded-lg border-0 bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={3}
            autoFocus
          />

          {/* Emoji picker */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Emoji</p>
            <div className="flex flex-wrap gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-lg p-1.5 text-lg transition-all ${emoji === e ? "bg-primary/10 ring-2 ring-primary/30 scale-110" : "hover:bg-secondary"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Color</p>
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
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`h-7 w-7 rounded-full ${bgMap[c.value]} transition-all ${color === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
                    title={c.label}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSubmit} disabled={!text.trim()} className="rounded-xl text-xs">
              Save Note
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {sortedNotes.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sortedNotes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={onDeleteNote} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-secondary/50 py-10 text-center">
          <span className="text-3xl">📅</span>
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <p className="text-xs text-muted-foreground/60">Select a date range to get started</p>
        </div>
      )}
    </div>
  );
}
