import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { CalendarNote } from "@/lib/calendar-types";

interface NoteCardProps {
  note: CalendarNote;
  onDelete: (id: string) => void;
}

const borderColorMap: Record<string, string> = {
  peach: "border-l-[color:var(--note-peach)]",
  mint: "border-l-[color:var(--note-mint)]",
  lavender: "border-l-[color:var(--note-lavender)]",
  sky: "border-l-[color:var(--note-sky)]",
  rose: "border-l-[color:var(--note-rose)]",
};

const bgColorMap: Record<string, string> = {
  peach: "bg-note-peach/30",
  mint: "bg-note-mint/30",
  lavender: "bg-note-lavender/30",
  sky: "bg-note-sky/30",
  rose: "bg-note-rose/30",
};

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const startDate = new Date(note.startDate + "T00:00:00");
  const endDate = new Date(note.endDate + "T00:00:00");
  const startStr = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isSame = note.startDate === note.endDate;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, x: -30 }}
      whileHover={{ scale: 1.03, y: -3, boxShadow: "0 8px 25px -5px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`group relative overflow-hidden rounded-xl border-l-4 ${borderColorMap[note.color] || borderColorMap.peach} ${bgColorMap[note.color] || bgColorMap.peach} bg-card p-4 shadow-sm`}
    >
      {/* Delete button */}
      <motion.button
        type="button"
        onClick={() => onDelete(note.id)}
        className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground/30 opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
        whileHover={{ scale: 1.2, rotate: 12 }}
        whileTap={{ scale: 0.8 }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </motion.button>

      <div className="flex items-start gap-3">
        <motion.span
          className="text-2xl"
          whileHover={{ scale: 1.4, rotate: [0, -15, 15, 0] }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          {note.emoji}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-relaxed text-foreground">{note.text}</p>
          <p className="mt-1.5 text-xs font-medium text-muted-foreground">
            {isSame ? startStr : `${startStr} — ${endStr}`}
          </p>
        </div>
      </div>

      {/* Subtle shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        whileHover={{ translateX: "200%" }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}
