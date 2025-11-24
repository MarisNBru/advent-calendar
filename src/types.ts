export interface CalendarEntry {
  day: number;
  type: 'text' | 'image' | 'voucher' | 'link' | 'gallery';
  title: string;
  content: string;
  imageUrl?: string;
  galleryImages?: string[];
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
