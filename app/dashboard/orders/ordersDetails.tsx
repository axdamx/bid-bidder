"use client";

import { useState } from "react";
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
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  ShoppingBag,
  XCircle,
} from "lucide-react";
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
import { getOrders, updateOrderShippingStatus } from "./action";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { LoadingModal } from "@/app/components/LoadingModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Order } from "@/app/types/order";
import { ShippingDetailsModal } from "@/app/components/ShippingDetailsModal";
import { OrderStatusSheet } from "@/app/components/OrderStatusSheet";

const StatusBadge = ({
  status,
}: {
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "paid"
    | "failed"
    | "unpaid"
    | "refunded";
}) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "default" as const,
      icon: Clock,
    },
    processing: {
      label: "Processing",
      variant: "secondary" as const,
      icon: Package,
    },
    shipped: {
      label: "Shipped",
      variant: "default" as const,
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      variant: "default" as const,
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive" as const,
      icon: XCircle,
    },
    paid: {
      label: "Paid",
      variant: "default" as const,
      icon: ShoppingBag,
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: XCircle,
    },
    unpaid: {
      label: "Unpaid",
      variant: "default" as const,
      icon: Clock,
    },
    refunded: {
      label: "Refunded",
      variant: "default" as const,
      icon: ShoppingBag,
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

export default function OrderDetails() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("winning");
  const { toast } = useToast();
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  const {
    data: orders,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(user?.id!),
    enabled: !!user?.id,
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Enable refetch on component mount
    refetchInterval: 30000, // Refresh every 30 seconds
    // staleTime: 10000, // Consider data stale after 10 seconds
    staleTime: 0, // Don't cache the data
    gcTime: 0, // Remove data from cache immediately
  });

  // Mutation for updating order shipping status
  const updateOrderShippingStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
      userId,
      shippingDetails,
    }: {
      orderId: number;
      status: string;
      userId: string;
      shippingDetails?: {
        courier: string;
        trackingNumber: string;
      };
    }) => updateOrderShippingStatus(orderId, status, userId, shippingDetails),
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

  const handleOrderShippingStatusUpdate = async (
    orderId: number,
    status: string
  ) => {
    if (status === "shipped") {
      setSelectedOrder({ id: orderId } as Order);
      setIsShippingModalOpen(true);
      return;
    }

    try {
      await updateOrderShippingStatusMutation.mutateAsync({
        orderId,
        status,
        userId: user?.id as string,
      });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleShippingDetailsSubmit = async (details: {
    courier: string;
    trackingNumber: string;
  }) => {
    if (!selectedOrder) return;

    try {
      await updateOrderShippingStatusMutation.mutateAsync({
        orderId: selectedOrder.id,
        status: "shipped",
        userId: user?.id as string,
        shippingDetails: details,
      });
      toast({
        title: "Success",
        description: "Shipping details updated successfully",
      });
      setIsShippingModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update shipping details",
        variant: "destructive",
      });
    }
  };

  const OrdersTable = ({
    orders,
    showStatusUpdate = false,
    type,
  }: {
    orders?: Order[];
    showStatusUpdate?: boolean;
    type?: string;
  }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    console.log("orders", orders);
    console.log("showStatusUpdate", showStatusUpdate);
    // if (isError) {

    // Calculate pagination
    const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders?.slice(startIndex, endIndex);

    return (
      <div className="rounded-md border h-full flex flex-col">
        {/* Desktop view */}
        <div className="hidden md:block">
          <div className="flex justify-end p-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Refreshing...</span>
              ) : (
                <span>Refresh Orders</span>
              )}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Final Amount</TableHead>
                {type === "selling" ? (
                  <TableHead>Update Status</TableHead>
                ) : (
                  <TableHead>Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders?.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {" "}
                    <Link
                      href={`/items/${order.itemId}`}
                      className="hover:underline text-primary"
                    >
                      {order.item.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    {type === "selling" ? (
                      <div className="space-y-2">
                        <Select
                          defaultValue={order.shippingStatus}
                          onValueChange={(value) =>
                            handleOrderShippingStatusUpdate(order.id, value)
                          }
                          disabled={
                            order.orderStatus === "cancelled" ||
                            order.shippingStatus === "shipped"
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update shipping status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            {/* <SelectItem value="processing">
                              Processing
                            </SelectItem> */}
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            {/* <SelectItem value="cancelled">Cancelled</SelectItem> */}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : order.orderStatus === "paid" ||
                      order.orderStatus === "delivered" ? (
                      <OrderStatusSheet order={order} disabled={false} />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-[180px]"
                        disabled={order.orderStatus === "cancelled"}
                      >
                        <Link href={`/checkout/${order.itemId}`}>
                          {order.orderStatus === "cancelled"
                            ? "Order Cancelled"
                            : "Proceed to checkout"}
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="">
              {/* Add this wrapper */}
              <Pagination className="p-4">
                {" "}
                {/* Added padding to the pagination */}
                <PaginationContent className="justify-center">
                  {" "}
                  {/* Add justify-center here */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Mobile view */}
        <div className="md:hidden h-full flex flex-col">
          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="flex justify-end p-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Refreshing...</span>
                ) : (
                  <span>Refresh Orders</span>
                )}
              </Button>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1">
            {currentOrders?.map((order: Order) => (
              <div
                key={order.id}
                className="bg-card rounded-lg shadow-sm border p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-card-foreground break-words">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-medium text-card-foreground">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Item</span>
                    <Link
                      href={`/items/${order.itemId}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {order.item.name}
                    </Link>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Order Status
                    </span>
                    <StatusBadge status={order.orderStatus} />
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      Shipping Status
                    </span>
                    <div className="text-right">
                      <StatusBadge status={order.shippingStatus || "pending"} />
                      {order.courierService && order.trackingNumber && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Courier: {order.courierService}</p>
                          <p>Tracking: {order.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  {type === "selling" ? (
                    <Select
                      defaultValue={order.shippingStatus}
                      onValueChange={(value) =>
                        handleOrderShippingStatusUpdate(order.id, value)
                      }
                      disabled={
                        order.orderStatus === "cancelled" ||
                        order.shippingStatus === "shipped"
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Update shipping status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : order.orderStatus === "paid" ||
                    order.orderStatus === "delivered" ? (
                    <OrderStatusSheet order={order} disabled={false} />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={order.orderStatus === "cancelled"}
                    >
                      <Link
                        href={`/checkout/${order.itemId}`}
                        className="w-full"
                      >
                        {order.orderStatus === "cancelled"
                          ? "Order Cancelled"
                          : "Proceed to checkout"}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-background border-t p-2">
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <LoadingModal isOpen={isUpdating} message="Updating order status..." />

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Connection Error</AlertDialogTitle>
            <AlertDialogDescription>
              There was a problem fetching your orders. Please check your
              connection and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                refetch();
                setShowErrorDialog(false);
              }}
            >
              Try Again
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ShippingDetailsModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        onSubmit={handleShippingDetailsSubmit}
      />

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="winning"
              className="px-2 py-1.5 text-sm sm:text-base sm:px-4 sm:py-2"
            >
              Winning
            </TabsTrigger>
            <TabsTrigger
              value="selling"
              className="px-2 py-1.5 text-sm sm:text-base sm:px-4 sm:py-2"
            >
              Selling
            </TabsTrigger>
          </TabsList>
          <div className="w-full">
            <TabsContent value="winning" className="w-full">
              <div className="md:h-auto h-[calc(100vh-12rem)] w-full overflow-hidden">
                <OrdersTable orders={orders?.winningOrders} type="winning" />
              </div>
            </TabsContent>
            <TabsContent value="selling" className="w-full">
              <div className="md:h-auto h-[calc(100vh-12rem)] w-full overflow-hidden">
                <OrdersTable
                  orders={orders?.sellingOrders}
                  showStatusUpdate={true}
                  type="selling"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
