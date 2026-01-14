import { useState, useEffect } from 'react';

const STORAGE_KEY = 'advent-calendar-opened-doors';

export function useAdventState() {
  const [openedDoors] = useState<Set<number>>(() => {
    // All 24 doors are considered opened from the start
    return new Set<number>(Array.from({ length: 24 }, (_, i) => i + 1));
  });

  // Doors are always opened; no toggling or persistence needed
  const toggleDoor = (_day: number) => {};
  const isDoorOpened = (day: number) => openedDoors.has(day);

  return { openedDoors, toggleDoor, isDoorOpened };
}
