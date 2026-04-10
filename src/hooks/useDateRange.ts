import { useState, useCallback } from "react";
import type { DateRange } from "@/lib/calendar-types";

export function useDateRange() {
  const [selection, setSelection] = useState<DateRange>({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

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
    setHoveredDate(null);
  }, []);

  // Touch handlers for mobile drag-select
  const handleTouchStart = useCallback((date: Date) => {
    startSelection(date);
  }, [startSelection]);

  const handleTouchMove = useCallback((date: Date) => {
    extendSelection(date);
    setHoveredDate(date);
  }, [extendSelection]);

  const handleTouchEnd = useCallback(() => {
    endSelection();
  }, [endSelection]);

  // Get normalized range (start always before end)
  const getNormalizedRange = useCallback((): DateRange => {
    if (!selection.start || !selection.end) return selection;
    if (selection.start <= selection.end) return selection;
    return { start: selection.end, end: selection.start };
  }, [selection]);

  return {
    selection,
    isSelecting,
    hoveredDate,
    setHoveredDate,
    startSelection,
    extendSelection,
    endSelection,
    clearSelection,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getNormalizedRange,
  };
}
