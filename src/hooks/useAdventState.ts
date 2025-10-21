import { useState, useEffect } from 'react';

const STORAGE_KEY = 'advent-calendar-opened-doors';

export function useAdventState() {
  const [openedDoors, setOpenedDoors] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(parsed);
      }
    } catch (error) {
      console.error('Failed to load opened doors from localStorage:', error);
    }
    return new Set<number>();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openedDoors)));
    } catch (error) {
      console.error('Failed to save opened doors to localStorage:', error);
    }
  }, [openedDoors]);

  const toggleDoor = (day: number) => {
    setOpenedDoors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const isDoorOpened = (day: number) => openedDoors.has(day);

  return { openedDoors, toggleDoor, isDoorOpened };
}
