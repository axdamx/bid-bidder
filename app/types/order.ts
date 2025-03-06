export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "paid"
  | "failed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type ShippingStatus = "pending" | "processing" | "shipped" | "delivered";

export type DealingMethodType = "SHIPPING" | "COD";

export interface OrderItem {
  name: string;
  imageId?: string;
  status: OrderStatus;
  dealingMethodType?: DealingMethodType;
  dealingMethodLocation?: string;
}

export interface Seller {
  name?: string;
  image?: string;
}
export interface Order {
  buyerId: string | undefined;
  id: number;
  itemId: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  orderDate: string;
  item: OrderItem;
  name: string;
  amount: number;
  totalAmount: number;
  courierService?: string;
  trackingNumber?: string;
  updatedAt?: string;
  deliveredAt?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippedAt?: string;
  shippingAddress?: string;
  paidAt?: string;
  sellerId?: string;
  seller: Seller;
}
