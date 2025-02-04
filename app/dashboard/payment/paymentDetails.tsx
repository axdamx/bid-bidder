"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import { getUserPayoutMethods, addPayoutMethod, setDefaultPayoutMethod, deletePayoutMethod, PayoutMethodFormData } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building, PlusCircle, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface PayoutMethod {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  country: string;
  isDefault: boolean;
}

const payoutMethodSchema = z.object({
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  accountNumber: z.string().min(5, "Account number must be at least 5 characters"),
  accountHolder: z.string().min(2, "Account holder name must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export default function PaymentsAndPayouts() {
  const [user] = useAtom(userAtom);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletePayoutMethodId, setDeletePayoutMethodId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const MAX_PAYOUT_METHODS = 3;

  const form = useForm<PayoutMethodFormData>({
    resolver: zodResolver(payoutMethodSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      country: "",
    },
  });

  // Query for fetching payout methods
  const { data: payoutMethods = [], isLoading } = useQuery({
    queryKey: ['payoutMethods', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const result = await getUserPayoutMethods(user.id);
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    enabled: !!user?.id,
  });

  // Mutation for adding payout method
  const addPayoutMethodMutation = useMutation({
    mutationFn: async (data: PayoutMethodFormData) => {
      if (!user?.id) throw new Error("User not found");
      return addPayoutMethod(user.id, data);
    },
    onSuccess: (result) => {
      if (result.error) {
        showError(result.error);
        return;
      }
      form.reset();
      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['payoutMethods'] });
    },
    onError: (error) => {
      showError("Failed to add payout method");
    },
  });

  // Mutation for setting default payout method
  const setDefaultPayoutMethodMutation = useMutation({
    mutationFn: async ({ payoutMethodId, userId }: { payoutMethodId: string; userId: string }) => {
      return setDefaultPayoutMethod(payoutMethodId, userId);
    },
    onSuccess: (result) => {
      if (result.error) {
        showError(result.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['payoutMethods'] });
    },
    onError: (error) => {
      showError("Failed to update default payout method");
    },
  });

  // Mutation for deleting payout method
  const deletePayoutMethodMutation = useMutation({
    mutationFn: async (payoutMethodId: string) => {
      if (!user?.id) throw new Error("User not found");
      return deletePayoutMethod(payoutMethodId, user.id);
    },
    onSuccess: (result) => {
      if (result.error) {
        showError(result.error);
        return;
      }
      setDeletePayoutMethodId(null);
      queryClient.invalidateQueries({ queryKey: ['payoutMethods'] });
    },
    onError: (error) => {
      showError("Failed to delete payout method");
    },
  });

  const handlePayoutMethodSubmit = async (data: PayoutMethodFormData) => {
    addPayoutMethodMutation.mutate(data);
  };

  const handleDefaultChange = async (payoutMethodId: string) => {
    if (!user?.id) return;
    setDefaultPayoutMethodMutation.mutate({ payoutMethodId, userId: user.id });
  };

  const handleDelete = (payoutMethodId: string) => {
    setDeletePayoutMethodId(payoutMethodId);
  };

  const confirmDelete = () => {
    if (deletePayoutMethodId) {
      deletePayoutMethodMutation.mutate(deletePayoutMethodId);
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsErrorDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Payout Methods</h2>
          <p className="text-sm text-muted-foreground">
            Add your payout methods for receiving payments ({payoutMethods.length}/3)
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={isLoading || payoutMethods.length >= MAX_PAYOUT_METHODS || addPayoutMethodMutation.isPending}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Payout Method
          {payoutMethods.length >= MAX_PAYOUT_METHODS && " (Max Reached)"}
        </Button>
      </div>

      {payoutMethods.length > 0 ? (
        <RadioGroup
          value={payoutMethods.find(m => m.isDefault)?.id}
          onValueChange={handleDefaultChange}
          className="grid gap-4"
        >
          {payoutMethods.map((method) => (
            <div key={method.id} className="relative">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
                disabled={isLoading || setDefaultPayoutMethodMutation.isPending}
              />
              <Label
                htmlFor={method.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {method.bankName}
                      {method.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.accountHolder} • •••• {method.accountNumber.slice(-4)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(method.id);
                  }}
                  disabled={deletePayoutMethodMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <Card className="p-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">No payout methods</h3>
            <p className="text-sm text-muted-foreground">
              Add a payout method to receive payments
            </p>
          </div>
        </Card>
      )}

      {/* Add Payout Method Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payout Method</DialogTitle>
            <DialogDescription>
              Enter your bank account details for receiving payouts
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handlePayoutMethodSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                {...form.register("bankName")}
                placeholder="Enter bank name"
              />
              {form.formState.errors.bankName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.bankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                {...form.register("accountNumber")}
                placeholder="Enter account number"
              />
              {form.formState.errors.accountNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.accountNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input
                id="accountHolder"
                {...form.register("accountHolder")}
                placeholder="Enter account holder name"
              />
              {form.formState.errors.accountHolder && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.accountHolder.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...form.register("country")}
                placeholder="Enter country"
              />
              {form.formState.errors.country && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addPayoutMethodMutation.isPending}
              >
                Add Payout Method
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Your payout method has been successfully added.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsErrorDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePayoutMethodId} onOpenChange={(open) => !open && setDeletePayoutMethodId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payout Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payout method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletePayoutMethodMutation.isPending}
            >
              {deletePayoutMethodMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
