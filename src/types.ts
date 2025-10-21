export interface CalendarEntry {
  day: number;
  type: 'text' | 'image' | 'voucher' | 'link';
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  audioUrl?: string;
  voucherCode?: string;
  voucherValidUntil?: string;
}

export interface AdventState {
  openedDoors: Set<number>;
  toggleDoor: (day: number) => void;
  isDoorOpened: (day: number) => boolean;
}
