import { Trash2 } from "lucide-react";
import type { CalendarNote } from "@/lib/calendar-types";

interface NoteCardProps {
  note: CalendarNote;
  onDelete: (id: string) => void;
}

const colorMap: Record<string, string> = {
  peach: "bg-note-peach",
  mint: "bg-note-mint",
  lavender: "bg-note-lavender",
  sky: "bg-note-sky",
  rose: "bg-note-rose",
};

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const startDate = new Date(note.startDate + "T00:00:00");
  const endDate = new Date(note.endDate + "T00:00:00");
  const startStr = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isSame = note.startDate === note.endDate;

  return (
    <div className={`group relative rounded-xl ${colorMap[note.color] || "bg-note-peach"} p-4 transition-all duration-200 hover:shadow-md animate-card-enter`}>
      <button
        type="button"
        onClick={() => onDelete(note.id)}
        className="absolute right-2 top-2 rounded-lg p-1.5 text-foreground/30 opacity-0 transition-all hover:bg-foreground/10 hover:text-foreground/60 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{note.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground leading-relaxed">{note.text}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {isSame ? startStr : `${startStr} — ${endStr}`}
          </p>
        </div>
      </div>
    </div>
  );
}
