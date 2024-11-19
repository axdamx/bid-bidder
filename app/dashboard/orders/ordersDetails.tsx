// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Package,
//   Truck,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   ShoppingBag,
//   MapPin,
//   Calendar,
//   CreditCard,
//   XCircle,
// } from "lucide-react";
// import Image from "next/image";

// // Extended mock data
// const mockOrders = [
//   {
//     id: "ORD-2024-001",
//     date: "2024-02-15T10:30:00",
//     status: "delivered",
//     total: 249.99,
//     items: [
//       {
//         id: "PROD-001",
//         name: "Premium Wireless Headphones",
//         price: 199.99,
//         quantity: 1,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//       {
//         id: "PROD-002",
//         name: "Phone Case",
//         price: 25.0,
//         quantity: 2,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//     shipping: {
//       address: {
//         street: "123 Main St",
//         city: "London",
//         postcode: "SW1A 1AA",
//         country: "United Kingdom",
//       },
//       method: "Standard Delivery",
//       trackingNumber: "TRK123456789",
//       estimatedDelivery: "2024-02-18",
//     },
//     payment: {
//       method: "Credit Card",
//       last4: "4242",
//       status: "paid",
//     },
//   },
//   {
//     id: "ORD-2024-002",
//     date: "2024-02-10T15:45:00",
//     status: "processing",
//     total: 499.99,
//     items: [
//       {
//         id: "PROD-003",
//         name: "Smart Watch Series 5",
//         price: 499.99,
//         quantity: 1,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//     shipping: {
//       address: {
//         street: "456 High Street",
//         city: "Manchester",
//         postcode: "M1 1AD",
//         country: "United Kingdom",
//       },
//       method: "Express Delivery",
//       trackingNumber: "TRK987654321",
//       estimatedDelivery: "2024-02-12",
//     },
//     payment: {
//       method: "PayPal",
//       email: "j***@example.com",
//       status: "paid",
//     },
//   },
//   {
//     id: "ORD-2024-003",
//     date: "2024-02-20T09:15:00",
//     status: "processing",
//     total: 149.97,
//     items: [
//       {
//         id: "PROD-004",
//         name: "Wireless Earbuds",
//         price: 79.99,
//         quantity: 1,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//       {
//         id: "PROD-005",
//         name: "Portable Charger",
//         price: 34.99,
//         quantity: 2,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//     shipping: {
//       address: {
//         street: "789 Park Lane",
//         city: "Birmingham",
//         postcode: "B1 1AA",
//         country: "United Kingdom",
//       },
//       method: "Standard Delivery",
//       trackingNumber: "TRK246813579",
//       estimatedDelivery: "2024-02-25",
//     },
//     payment: {
//       method: "Debit Card",
//       last4: "9876",
//       status: "paid",
//     },
//   },
//   {
//     id: "ORD-2024-004",
//     date: "2024-02-18T14:20:00",
//     status: "shipped",
//     total: 299.99,
//     items: [
//       {
//         id: "PROD-006",
//         name: "4K Action Camera",
//         price: 299.99,
//         quantity: 1,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//     shipping: {
//       address: {
//         street: "101 Queen Street",
//         city: "Glasgow",
//         postcode: "G1 3BZ",
//         country: "United Kingdom",
//       },
//       method: "Express Delivery",
//       trackingNumber: "TRK135792468",
//       estimatedDelivery: "2024-02-21",
//     },
//     payment: {
//       method: "Credit Card",
//       last4: "1111",
//       status: "paid",
//     },
//   },
// ];

// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     pending: {
//       label: "Pending",
//       variant: "outline",
//       icon: Clock,
//     },
//     processing: {
//       label: "Processing",
//       variant: "secondary",
//       icon: Package,
//     },
//     shipped: {
//       label: "Shipped",
//       variant: "default",
//       icon: Truck,
//     },
//     delivered: {
//       label: "Delivered",
//       variant: "success",
//       icon: CheckCircle2,
//     },
//     cancelled: {
//       label: "Cancelled",
//       variant: "destructive",
//       icon: XCircle,
//     },
//   };

//   const config = statusConfig[status] || statusConfig.pending;
//   const Icon = config.icon;

//   return (
//     <Badge variant={config.variant} className="flex items-center gap-1">
//       <Icon className="h-3 w-3" />
//       {config.label}
//     </Badge>
//   );
// };

// const OrderTimeline = ({ order }) => {
//   const timeline = [
//     {
//       date: new Date(order.date),
//       status: "Order Placed",
//       description: "Your order has been confirmed",
//       icon: ShoppingBag,
//     },
//     {
//       date: new Date(order.date),
//       status: "Processing",
//       description: "Your order is being processed",
//       icon: Package,
//     },
//     {
//       date: new Date(order.shipping.estimatedDelivery),
//       status: "Out for Delivery",
//       description: `Tracking number: ${order.shipping.trackingNumber}`,
//       icon: Truck,
//     },
//     {
//       date: new Date(order.shipping.estimatedDelivery),
//       status: "Delivered",
//       description: "Your order has been delivered",
//       icon: CheckCircle2,
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       {timeline.map((event, index) => (
//         <div key={index} className="flex items-start gap-4">
//           <div className="p-2 bg-primary/10 rounded-full">
//             <event.icon className="h-4 w-4 text-primary" />
//           </div>
//           <div className="flex-1">
//             <p className="font-medium">{event.status}</p>
//             <p className="text-sm text-muted-foreground">{event.description}</p>
//             <p className="text-sm text-muted-foreground">
//               {event.date.toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default function OrderDetails() {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");

//   const filteredOrders = mockOrders.filter((order) => {
//     if (activeTab === "all") return true;
//     return order.status === activeTab;
//   });

//   return (
//     <div className="max-w-7xl mx-auto p-4 space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Order History</CardTitle>
//           <CardDescription>View and manage your orders</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="w-full"
//           >
//             <TabsList>
//               <TabsTrigger value="all">All Orders</TabsTrigger>
//               <TabsTrigger value="processing">Processing</TabsTrigger>
//               <TabsTrigger value="shipped">Shipped</TabsTrigger>
//               <TabsTrigger value="delivered">Delivered</TabsTrigger>
//             </TabsList>
//             <TabsContent value={activeTab} className="mt-4">
//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Items</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredOrders.map((order) => (
//                       <TableRow key={order.id}>
//                         <TableCell className="font-medium">
//                           {order.id}
//                         </TableCell>
//                         <TableCell>
//                           {new Date(order.date).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           {order.items.map((item) => item.name).join(", ")}
//                         </TableCell>
//                         <TableCell>
//                           <StatusBadge status={order.status} />
//                         </TableCell>
//                         <TableCell>£{order.total.toFixed(2)}</TableCell>
//                         <TableCell>
//                           <Sheet>
//                             <SheetTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setSelectedOrder(order)}
//                               >
//                                 View Details
//                               </Button>
//                             </SheetTrigger>
//                             <SheetContent
//                               side="right"
//                               className="w-[600px] sm:w-[540px]"
//                             >
//                               {selectedOrder && (
//                                 <>
//                                   <SheetHeader>
//                                     <SheetTitle>
//                                       Order {selectedOrder.id}
//                                     </SheetTitle>
//                                     <SheetDescription>
//                                       Placed on{" "}
//                                       {new Date(
//                                         selectedOrder.date
//                                       ).toLocaleDateString()}
//                                     </SheetDescription>
//                                   </SheetHeader>
//                                   <div className="mt-6 space-y-6">
//                                     <div>
//                                       <h3 className="font-semibold mb-2">
//                                         Items
//                                       </h3>
//                                       <div className="space-y-4">
//                                         {selectedOrder.items.map((item) => (
//                                           <div
//                                             key={item.id}
//                                             className="flex items-center gap-4"
//                                           >
//                                             <Image
//                                               src={item.image}
//                                               alt={item.name}
//                                               className="h-16 w-16 rounded-md object-cover"
//                                               width={64}
//                                               height={64}
//                                             />
//                                             <div className="flex-1">
//                                               <p className="font-medium">
//                                                 {item.name}
//                                               </p>
//                                               <p className="text-sm text-muted-foreground">
//                                                 Quantity: {item.quantity}
//                                               </p>
//                                               <p className="text-sm font-medium">
//                                                 £{item.price.toFixed(2)}
//                                               </p>
//                                             </div>
//                                           </div>
//                                         ))}
//                                       </div>
//                                     </div>
//                                     <Separator />
//                                     <div>
//                                       <h3 className="font-semibold mb-2">
//                                         Shipping Details
//                                       </h3>
//                                       <div className="space-y-2">
//                                         <div className="flex items-center gap-2">
//                                           <MapPin className="h-4 w-4 text-muted-foreground" />
//                                           <p className="text-sm">
//                                             {
//                                               selectedOrder.shipping.address
//                                                 .street
//                                             }
//                                             ,{" "}
//                                             {
//                                               selectedOrder.shipping.address
//                                                 .city
//                                             }
//                                             ,{" "}
//                                             {
//                                               selectedOrder.shipping.address
//                                                 .postcode
//                                             }
//                                           </p>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                           <Truck className="h-4 w-4 text-muted-foreground" />
//                                           <p className="text-sm">
//                                             {selectedOrder.shipping.method}
//                                           </p>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                                           <p className="text-sm">
//                                             Estimated Delivery:{" "}
//                                             {new Date(
//                                               selectedOrder.shipping.estimatedDelivery
//                                             ).toLocaleDateString()}
//                                           </p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                     <Separator />
//                                     <div>
//                                       <h3 className="font-semibold mb-2">
//                                         Payment Information
//                                       </h3>
//                                       <div className="space-y-2">
//                                         <div className="flex items-center gap-2">
//                                           <CreditCard className="h-4 w-4 text-muted-foreground" />
//                                           <p className="text-sm">
//                                             {selectedOrder.payment.method}
//                                             {selectedOrder.payment.last4 &&
//                                               ` (**** ${selectedOrder.payment.last4})`}
//                                           </p>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                           <AlertCircle className="h-4 w-4 text-muted-foreground" />
//                                           <p className="text-sm capitalize">
//                                             Status:{" "}
//                                             {selectedOrder.payment.status}
//                                           </p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                     <Separator />
//                                     <div>
//                                       <h3 className="font-semibold  mb-2">
//                                         Order Timeline
//                                       </h3>
//                                       <OrderTimeline order={selectedOrder} />
//                                     </div>
//                                   </div>
//                                 </>
//                               )}
//                             </SheetContent>
//                           </Sheet>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Calendar,
  CreditCard,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, Order, updateOrderStatus } from "./action";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { LoadingModal } from "@/app/components/LoadingModal";

// Extended mock data
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-02-15T10:30:00",
    status: "delivered",
    total: 249.99,
    items: [
      {
        id: "PROD-001",
        name: "Premium Wireless Headphones",
        price: 199.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "PROD-002",
        name: "Phone Case",
        price: 25.0,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    shipping: {
      address: {
        street: "123 Main St",
        city: "London",
        postcode: "SW1A 1AA",
        country: "United Kingdom",
      },
      method: "Standard Delivery",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-02-18",
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      status: "paid",
    },
  },
  {
    id: "ORD-2024-002",
    date: "2024-02-10T15:45:00",
    status: "processing",
    total: 499.99,
    items: [
      {
        id: "PROD-003",
        name: "Smart Watch Series 5",
        price: 499.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    shipping: {
      address: {
        street: "456 High Street",
        city: "Manchester",
        postcode: "M1 1AD",
        country: "United Kingdom",
      },
      method: "Express Delivery",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-02-12",
    },
    payment: {
      method: "PayPal",
      email: "j***@example.com",
      status: "paid",
    },
  },
  {
    id: "ORD-2024-003",
    date: "2024-02-20T09:15:00",
    status: "processing",
    total: 149.97,
    items: [
      {
        id: "PROD-004",
        name: "Wireless Earbuds",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "PROD-005",
        name: "Portable Charger",
        price: 34.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    shipping: {
      address: {
        street: "789 Park Lane",
        city: "Birmingham",
        postcode: "B1 1AA",
        country: "United Kingdom",
      },
      method: "Standard Delivery",
      trackingNumber: "TRK246813579",
      estimatedDelivery: "2024-02-25",
    },
    payment: {
      method: "Debit Card",
      last4: "9876",
      status: "paid",
    },
  },
  {
    id: "ORD-2024-004",
    date: "2024-02-18T14:20:00",
    status: "shipped",
    total: 299.99,
    items: [
      {
        id: "PROD-006",
        name: "4K Action Camera",
        price: 299.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    shipping: {
      address: {
        street: "101 Queen Street",
        city: "Glasgow",
        postcode: "G1 3BZ",
        country: "United Kingdom",
      },
      method: "Express Delivery",
      trackingNumber: "TRK135792468",
      estimatedDelivery: "2024-02-21",
    },
    payment: {
      method: "Credit Card",
      last4: "1111",
      status: "paid",
    },
  },
];

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "outline",
      icon: Clock,
    },
    processing: {
      label: "Processing",
      variant: "secondary",
      icon: Package,
    },
    shipped: {
      label: "Shipped",
      variant: "default",
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      variant: "success",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const OrderTimeline = ({ order }) => {
  const timeline = [
    {
      date: new Date(order.date),
      status: "Order Placed",
      description: "Your order has been confirmed",
      icon: ShoppingBag,
    },
    {
      date: new Date(order.date),
      status: "Processing",
      description: "Your order is being processed",
      icon: Package,
    },
    {
      date: new Date(order.shipping.estimatedDelivery),
      status: "Out for Delivery",
      description: `Tracking number: ${order.shipping.trackingNumber}`,
      icon: Truck,
    },
    {
      date: new Date(order.shipping.estimatedDelivery),
      status: "Delivered",
      description: "Your order has been delivered",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <event.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{event.status}</p>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <p className="text-sm text-muted-foreground">
              {event.date.toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function OrderDetails() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("winning");
  const { toast } = useToast();
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(user?.id!),
    enabled: !!user?.id,
    // refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
  });

  // Mutation for updating order status
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatus(orderId, status, user?.id!),
    onMutate: () => {
      setIsUpdating(true);
    },
    onSettled: () => {
      setIsUpdating(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatus({ orderId, status: newStatus });
  };

  const OrdersTable = ({ orders, showStatusUpdate = false }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            {showStatusUpdate && <TableHead>Update Status</TableHead>}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order: Order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.item.name}</TableCell>
              <TableCell>
                {new Date(order.orderDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {showStatusUpdate ? (
                  <Select
                    defaultValue={order.orderStatus}
                    onValueChange={(value) =>
                      handleStatusUpdate(order.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={order.orderStatus} />
                )}
              </TableCell>
              <TableCell>{formatCurrency(order.amount)}</TableCell>
              <TableCell>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                  </SheetTrigger>
                  {/* Update your SheetContent to use the new Order type */}
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <LoadingModal isOpen={isUpdating} message="Updating order status..." />
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and manage your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="winning">Winning Orders</TabsTrigger>
                <TabsTrigger value="selling">Selling Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="winning">
                <OrdersTable
                  orders={orders?.winningOrders}
                  showStatusUpdate={false}
                />
              </TabsContent>
              <TabsContent value="selling">
                <OrdersTable
                  orders={orders?.sellingOrders}
                  showStatusUpdate={true}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
