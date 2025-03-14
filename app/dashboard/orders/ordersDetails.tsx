"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Banknote,
  CheckCircle,
  CreditCard,
  PackageCheck,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  ShieldCheck,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import Link from "next/link";
import { Order } from "@/app/types/order";
import { ShippingDetailsModal } from "@/app/components/ShippingDetailsModal";
import { OrderStatusSheet } from "@/app/components/OrderStatusSheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const DealingMethodBadge = ({ type }: { type: string }) => {
  const getMethodColor = (type: string) => {
    if (!type) return null;
    switch (type.toLowerCase()) {
      case "cod":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "shipping":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMethodIcon = (type: string) => {
    if (!type) return null;
    switch (type.toLowerCase()) {
      case "cod":
        return <Banknote className="h-3 w-3 mr-1" />;
      case "shipping":
        return <Truck className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMethodColor(
        type
      )}`}
    >
      {getMethodIcon(type)}
      {type && type.toUpperCase()}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case "paid":
        return <CreditCard className="h-3 w-3 mr-1" />;
      case "unpaid":
        return <Clock className="h-3 w-3 mr-1" />;
      case "pending":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "shipped":
        return <Truck className="h-3 w-3 mr-1" />;
      case "delivered":
        return <PackageCheck className="h-3 w-3 mr-1" />;
      case "cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <CheckCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Helper function to determine available status options
const getAvailableStatusOptions = (
  currentStatus: string,
  dealingMethodType?: string,
  paymentStatus?: string
) => {
  // If payment is unpaid, only allow pending status
  if (paymentStatus === "unpaid") {
    return ["pending"];
  }

  // If status is delivered, disable all options
  if (currentStatus === "delivered") {
    return [];
  }

  if (dealingMethodType === "COD") {
    // For COD orders, only allow pending status
    return ["pending"];
  }

  // Original logic for non-COD orders
  switch (currentStatus) {
    case "pending":
      return ["pending", "shipped"];
    case "shipped":
      return [currentStatus]; // Once shipped, no further updates allowed
    default:
      return [currentStatus];
  }
};

const OrdersTable = ({
  orders,
  type,
  isLoading,
  onRefresh,
  onOrderShippingStatusUpdate,
  handleLinkClick,
}: {
  orders: Order[] | undefined;
  type: "buying" | "selling";
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onOrderShippingStatusUpdate: (
    orderId: number,
    status: string,
    previousStatus?: string
  ) => void;
  handleLinkClick: (e: React.MouseEvent, path: string) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sort orders by orderDate (newest first)
  const sortedOrders = orders?.slice().sort((a, b) => {
    return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
  });

  const totalPages = Math.ceil((sortedOrders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = sortedOrders?.slice(startIndex, endIndex);

  const RefreshButton = () => (
    <Button
      onClick={onRefresh}
      variant="outline"
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Refreshing...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Orders</span>
        </span>
      )}
    </Button>
  );

  const TableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          {type === "selling" && (
            <>
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </>
          )}
        </div>
      ))}
    </div>
  );

  const MobileOrderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg shadow-sm border p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <div className="pt-3 border-t">
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="hidden md:flex justify-end mb-4">
        <RefreshButton />
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Dealing Method</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment Status</TableHead>
                {/* <TableHead>
                  <div className="flex items-center gap-1">
                    Final Amount
                    {type === "selling" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              For SHIPPING orders, this is the amount you will
                              receive (sold price + shipping cost). For COD, the
                              final amount is the item's (sold price)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {type === "buying" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              For SHIPPING orders, total amount is the amount
                              you have paid (sold price + shipping cost). For
                              COD, total amount is the item's (sold price)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableHead> */}
                {type === "selling" ? (
                  <>
                    <TableHead>Update Status</TableHead>
                    <TableHead>View Order</TableHead>
                  </>
                ) : (
                  <TableHead>Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={type === "selling" ? 8 : 7}>
                    <TableSkeleton />
                  </TableCell>
                </TableRow>
              ) : currentOrders?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={type === "selling" ? 8 : 7}
                    className="text-center h-24"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders?.map((order: Order) => (
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
                      <DealingMethodBadge
                        type={order.item.dealingMethodType!}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.paymentStatus} />
                    </TableCell>
                    {/* <TableCell>
                      {formatCurrency(order.amount + (order.shippingCost || 0))}
                    </TableCell> */}
                    <TableCell>
                      {type === "selling" ? (
                        <div className="space-y-2">
                          <Select
                            value={order.shippingStatus}
                            onValueChange={(value) =>
                              onOrderShippingStatusUpdate(
                                order.id,
                                value,
                                order.shippingStatus
                              )
                            }
                            disabled={order.orderStatus === "cancelled"}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Update shipping status" />
                            </SelectTrigger>
                            <SelectContent>
                              {["pending", "shipped", "delivered"].map(
                                (status) => {
                                  const isAvailable = getAvailableStatusOptions(
                                    order.shippingStatus,
                                    order.item.dealingMethodType,
                                    order.paymentStatus
                                  ).includes(status);

                                  return (
                                    <SelectItem
                                      key={status}
                                      value={status}
                                      disabled={!isAvailable}
                                      className={
                                        !isAvailable
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }
                                    >
                                      {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                    </SelectItem>
                                  );
                                }
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : order.orderStatus === "paid" ||
                        order.orderStatus === "shipped" ||
                        order.orderStatus === "delivered" ? (
                        <OrderStatusSheet order={order} disabled={false} />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-[180px]"
                          disabled={order.orderStatus === "cancelled"}
                        >
                          <Link
                            href={`/checkout/${order.itemId}`}
                            onClick={(e) =>
                              handleLinkClick(e, `/checkout/${order.itemId}`)
                            }
                          >
                            {order.orderStatus === "cancelled"
                              ? "Order Cancelled"
                              : "Proceed to checkout"}
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                    {type === "selling" && (
                      <TableCell>
                        <OrderStatusSheet order={order} disabled={false} />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && orders && orders.length > 0 && <Pagination />}
      </div>

      {/* Mobile view */}
      <div className="md:hidden h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex justify-between items-center p-2">
            <h2 className="font-semibold">
              {type === "selling" ? "Items Sold" : "Items Won"}
            </h2>
            <RefreshButton />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-2 pb-4 space-y-4">
            {isLoading ? (
              <MobileOrderSkeleton />
            ) : currentOrders?.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No orders found
              </div>
            ) : (
              <div className="space-y-4">
                {currentOrders?.map((order: Order) => (
                  <div
                    key={order.id}
                    className="bg-card rounded-lg shadow-sm border p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-medium text-card-foreground">
                            Order #{order.id}
                          </h3>
                          <DealingMethodBadge
                            type={order.item.dealingMethodType!}
                          />
                        </div>
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
                        <span className="text-sm text-muted-foreground">
                          Item
                        </span>
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
                          <StatusBadge
                            status={order.shippingStatus || "pending"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      {type === "selling" ? (
                        <div className="space-y-3">
                          <Select
                            value={order.shippingStatus}
                            onValueChange={(value) =>
                              onOrderShippingStatusUpdate(
                                order.id,
                                value,
                                order.shippingStatus
                              )
                            }
                            disabled={order.orderStatus === "cancelled"}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Update shipping status" />
                            </SelectTrigger>
                            <SelectContent>
                              {["pending", "shipped", "delivered"].map(
                                (status) => {
                                  const isAvailable = getAvailableStatusOptions(
                                    order.shippingStatus,
                                    order.item.dealingMethodType,
                                    order.paymentStatus
                                  ).includes(status);

                                  return (
                                    <SelectItem
                                      key={status}
                                      value={status}
                                      disabled={!isAvailable}
                                      className={
                                        !isAvailable
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }
                                    >
                                      {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                    </SelectItem>
                                  );
                                }
                              )}
                            </SelectContent>
                          </Select>
                          <OrderStatusSheet order={order} disabled={false} />
                        </div>
                      ) : order.orderStatus === "paid" ||
                        order.orderStatus === "shipped" ||
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
            )}
          </div>
        </div>

        {!isLoading && orders && orders.length > 0 && (
          <div className="sticky bottom-0 bg-background border-t">
            <Pagination />
          </div>
        )}
      </div>
    </div>
  );
};

export default function OrderDetails() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("winning");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [orderBeingUpdated, setOrderBeingUpdated] = useState<{
    id: number;
    previousStatus: string;
  } | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleLinkClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === pathname) return;
    setIsNavigating(true);
    router.push(path);
  };

  // Check if we need to refetch data based on URL params
  useEffect(() => {
    const refreshParam = searchParams.get("refresh");
    if (refreshParam && user?.id) {
      // Invalidate and refetch data when refresh parameter is present
      queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
    }
  }, [searchParams, queryClient, user?.id]);

  const {
    data: orders,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(user?.id!),
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
    // refetchInterval: 5000, // Poll every 5 seconds for updates
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
    status: string,
    previousStatus?: string
  ) => {
    if (status === "shipped") {
      // Store the current order and its previous status
      let currentOrder: Order | undefined;

      // Find the order in either winningOrders or sellingOrders
      if (orders?.winningOrders) {
        currentOrder = orders.winningOrders.find(
          (order: Order) => order.id === orderId
        );
      }

      if (!currentOrder && orders?.sellingOrders) {
        currentOrder = orders.sellingOrders.find(
          (order: Order) => order.id === orderId
        );
      }

      if (currentOrder) {
        setOrderBeingUpdated({
          id: orderId,
          previousStatus:
            previousStatus || currentOrder.shippingStatus || "pending",
        });
        setSelectedOrder({ id: orderId } as Order);
        setIsShippingModalOpen(true);
      }
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

  return (
    <div className="h-full flex flex-col">
      <ShippingDetailsModal
        isOpen={isShippingModalOpen}
        onClose={() => {
          setIsShippingModalOpen(false);
          // Force a refetch to reset the UI state
          if (orderBeingUpdated) {
            // Refetch to reset the UI
            queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
            setOrderBeingUpdated(null);
          }
        }}
        onSubmit={handleShippingDetailsSubmit}
      />

      <div className="max-w-7xl mx-auto w-full p-4 space-y-8 flex-1 overflow-hidden">
        {/* Information Section */}
        <Card className="mb-8">
          <CardHeader className="md:text-center">
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Learn about the order process based on your dealing method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buyer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer">For Buyers</TabsTrigger>
                <TabsTrigger value="seller">For Sellers</TabsTrigger>
              </TabsList>
              <TabsContent value="buyer" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold">Shipping Payment</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <ul className="space-y-3 pl-7">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Complete online payment to confirm your order
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Track shipping status and delivery progress
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Confirm delivery when you receive the item
                          </span>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="rounded-lg border p-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <ul className="space-y-3 pl-7">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Complete payment to get seller's contact information
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Contact seller to arrange meetup details
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Meet safely and inspect item before payment
                          </span>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </TabsContent>

              <TabsContent value="seller" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold">Shipping Orders</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <ul className="space-y-3 pl-7">
                        <li className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Prepare and ship the item promptly
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Update shipping status with tracking details
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Monitor order completion and payment status
                          </span>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="rounded-lg border p-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <ul className="space-y-3 pl-7">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Your contact info will be shared after buyer's
                            payment
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Coordinate with buyer for meetup arrangement
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            Complete the transaction safely in person
                          </span>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="winning">Items Won</TabsTrigger>
            <TabsTrigger value="selling">Items Sold</TabsTrigger>
          </TabsList>

          <TabsContent value="winning" className="mt-0">
            <OrdersTable
              orders={orders?.winningOrders}
              type="buying"
              isLoading={isLoading}
              onRefresh={async () => {
                await refetch();
              }}
              onOrderShippingStatusUpdate={handleOrderShippingStatusUpdate}
              handleLinkClick={handleLinkClick}
            />
          </TabsContent>
          <TabsContent value="selling" className="mt-0">
            <OrdersTable
              orders={orders?.sellingOrders}
              type="selling"
              isLoading={isLoading}
              onRefresh={async () => {
                await refetch();
              }}
              onOrderShippingStatusUpdate={handleOrderShippingStatusUpdate}
              handleLinkClick={handleLinkClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
