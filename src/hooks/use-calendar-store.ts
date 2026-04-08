import { useState, useCallback, useEffect } from "react";
import type { CalendarNote, DateRange } from "@/lib/calendar-types";

const STORAGE_KEY = "smart-story-calendar-notes";

function loadNotes(): CalendarNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: CalendarNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useCalendarStore() {
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selection, setSelection] = useState<DateRange>({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const addNote = useCallback((note: Omit<CalendarNote, "id">) => {
    setNotes((prev) => {
      const next = [...prev, { ...note, id: crypto.randomUUID() }];
      saveNotes(next);
      return next;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(next);
      return next;
    });
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const startSelection = useCallback((date: Date) => {
    setSelection({ start: date, end: date });
    setIsSelecting(true);
  }, []);

  const extendSelection = useCallback((date: Date) => {
    if (!isSelecting) return;
    setSelection((prev) => ({ ...prev, end: date }));
  }, [isSelecting]);

  const endSelection = useCallback(() => {
    setIsSelecting(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelection({ start: null, end: null });
    setIsSelecting(false);
  }, []);

  return {
    notes,
    currentMonth,
    selection,
    isSelecting,
    hoveredDate,
    setHoveredDate,
    addNote,
    deleteNote,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    startSelection,
    extendSelection,
    endSelection,
    clearSelection,
  };
}
