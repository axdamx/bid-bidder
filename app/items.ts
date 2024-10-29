// types/items.ts
export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: null;
  image: string;
  // ... other user fields
};

export type Item = {
  id: number;
  userId: string;
  name: string;
  currentBid: number;
  startingPrice: number;
  imageId: string | null;
  bidInterval: number;
  endDate: Date;
  description: string | null;
  status: string | null;
  winnerId: string | null;
};

export type ItemWithUser = Item & {
  user: User;
};
