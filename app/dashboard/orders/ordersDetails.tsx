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
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
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
import { getOrders, updateOrderStatus } from "./action";
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

// Extended mock data

interface Order {
  id: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  item: {
    name: string;
  };
  orderDate: string;
  amount: number;
  itemId: number;
}

const StatusBadge = ({ status }: { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }) => {
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

  const {
    data: orders,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(user?.id!),
    enabled: !!user?.id,
    // refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: true, // Prevent refetch on component mount
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

  const OrdersTable = ({ 
    orders, 
    showStatusUpdate = false 
  }: { 
    orders?: Order[]; 
    showStatusUpdate?: boolean 
  }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination
    const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders?.slice(startIndex, endIndex);
    return (
      <div className="overflow-x-auto rounded-md border">
        {/* Desktop view */}
        <div className="hidden md:block">
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
              {currentOrders?.map((order: Order) => (
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
                          onClick={() => console.log(order.itemId)}
                        >
                          {/* <Link href={`/items/${order.itemId}`}>View Item</Link> */}
                          <Link href={`/checkout/${order.itemId}`}>
                            View Item
                          </Link>
                        </Button>
                      </SheetTrigger>
                      {/* Update your SheetContent to use the new Order type */}
                    </Sheet>
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
        <div className="md:hidden overflow-y-auto max-h-[400px]">
          <div className="min-w-[320px] overflow-x-auto">
            {" "}
            {/* Added wrapper with min-width */}
            {/* Set max height and enable vertical scrolling */}
            {currentOrders?.map((order: Order) => (
              <div key={order.id} className="border-b p-2 space-y-3">
                <div className="flex justify-between items-start px-9">
                  <div>
                    <p className="text-sm">{order.item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {order.id}
                    </p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>

                <div className="flex justify-between items-center text-sm px-9">
                  <span className="text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm">
                    {formatCurrency(order.amount)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {showStatusUpdate && (
                    <Select
                      defaultValue={order.orderStatus}
                      onValueChange={(value) =>
                        handleStatusUpdate(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-full">
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
                  )}

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-full"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                    </SheetTrigger>
                    {/* Sheet content remains the same */}
                  </Sheet>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="justify-center p-4">
              {/* Added padding to the pagination */}
              <PaginationContent>
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
          )}
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

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and manage your orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6"> */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="winning">Winning</TabsTrigger>
            <TabsTrigger value="selling">Selling</TabsTrigger>
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
        {/* </CardContent>
        </Card> */}
      </div>
    </>
  );
}
