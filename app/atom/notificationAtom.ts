import { atom } from "jotai";

export interface Notification {
  id: string;
  userId: string;
  type: "bid" | "other"; // expand as needed
  itemId: number; // changed to number since it's integer in DB
  itemTitle: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export const notificationsAtom = atom<Notification[]>([]);
export const unreadCountAtom = atom((get) => {
  const notifications = get(notificationsAtom);
  return notifications.filter((n) => !n.read).length;
});
