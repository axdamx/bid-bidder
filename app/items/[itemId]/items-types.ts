// types/items.ts
export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type Bid = {
  id: number;
  itemId: number;
  userId: string;
  amount: number;
  createdAt: Date;
  user: {
    name: string;
    image: string;
  };
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
  user: User;
};

export type PurchaseType = "auction" | "buyItNow";
export type PurchaseStatus = {
  type: PurchaseType;
  price: number;
  isWinner: boolean;
};
export type ModalView = "log-in" | "sign-up" | "forgot-password";
