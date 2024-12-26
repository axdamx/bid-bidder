import { atom } from "jotai";

export type User = {
  id: string;
  email: string;
  name: string;
  image?: string;
  hasSeenOnboarding?: boolean;
};

export const userAtom = atom<User | null>(null);
