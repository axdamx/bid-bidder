"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";
import {
  getUserAddresses,
  setDefaultAddress,
  addAddress,
  updateAddress,
  AddressFormData,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Home, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Address {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  isDefault: boolean;
}

const addressSchema = z.object({
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postcode: z.string().min(2, "Postcode must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export default function AddressDetails() {
  const [user] = useAtom(userAtom);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [defaultAddressId, setDefaultAddressId] = useState<string>("");

  const MAX_ADDRESSES = 3;
  const canAddAddress = addresses.length < MAX_ADDRESSES;

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (selectedAddress) {
      form.reset({
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2 || "",
        city: selectedAddress.city,
        state: selectedAddress.state,
        postcode: selectedAddress.postcode,
        country: selectedAddress.country,
      });
    } else {
      form.reset({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      });
    }
  }, [selectedAddress, form]);

  useEffect(() => {
    if (user?.id) {
      loadAddresses();
    }
  }, [user?.id]);

  const loadAddresses = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const result = await getUserAddresses(user.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.success && result.data) {
        setAddresses(result.data);
        const defaultAddress = result.data.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setDefaultAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDefaultChange = async (addressId: string) => {
    if (!user?.id || addressId === defaultAddressId) return;

    setIsLoading(true);
    try {
      const result = await setDefaultAddress(addressId, user.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.success) {
        setDefaultAddressId(addressId);
        toast.success("Default address updated");
        loadAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    if (!user?.id) return;

    // Check if we're at the limit when adding a new address
    if (!selectedAddress && addresses.length >= MAX_ADDRESSES) {
      toast.error("Maximum number of addresses reached");
      return;
    }

    setIsLoading(true);
    try {
      const result = selectedAddress
        ? await updateAddress(selectedAddress.id, data)
        : await addAddress(user.id, data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(selectedAddress ? "Address updated" : "Address added");
      loadAddresses();
      setIsDialogOpen(false);
      setSelectedAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddressDialog = (address?: Address) => {
    setSelectedAddress(address || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">
              Your addresses is listed here
            </h4>
            <p className="text-xs text-muted-foreground">
              {`${addresses.length}/${MAX_ADDRESSES} addresses added`}
            </p>
          </div>
          <Button
            onClick={() => openAddressDialog()}
            disabled={isLoading || !canAddAddress}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Address
            {!canAddAddress && " (Max Reached)"}
          </Button>
          {/* <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={
            isLoading ||
            payoutMethods.length >= MAX_PAYOUT_METHODS ||
            addPayoutMethodMutation.isPending
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Payout Method
          {payoutMethods.length >= MAX_PAYOUT_METHODS && " (Max Reached)"}
        </Button> */}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <Card key={n} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-4 w-4 mt-1 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        ) : addresses.length > 0 ? (
          <RadioGroup
            value={defaultAddressId}
            onValueChange={handleDefaultChange}
            className="grid gap-4"
          >
            {addresses.map((address) => (
              <div key={address.id} className="relative">
                <RadioGroupItem
                  value={address.id}
                  id={`address-${address.id}`}
                  className="peer sr-only"
                  disabled={isLoading}
                />
                <Label
                  htmlFor={`address-${address.id}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">
                          {address.addressLine1}
                        </span>
                        {address.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </div>
                      {address.addressLine2 && (
                        <span className="text-sm text-muted-foreground truncate">
                          {address.addressLine2}
                        </span>
                      )}
                      <br />
                      <span className="text-sm truncate">
                        {`${address.city}, ${address.state} ${address.postcode}`}
                      </span>
                      <br />
                      <span className="text-sm">{address.country}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
                    onClick={(e) => {
                      e.preventDefault();
                      openAddressDialog(address);
                    }}
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">No addresses</h3>
              <p className="text-sm text-muted-foreground">
                Add an address to get started
              </p>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleAddressSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  placeholder="Street address"
                  {...form.register("addressLine1")}
                />
                {form.formState.errors.addressLine1 && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, etc."
                  {...form.register("addressLine2")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    {...form.register("city")}
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    {...form.register("state")}
                  />
                  {form.formState.errors.state && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    placeholder="Postcode"
                    {...form.register("postcode")}
                  />
                  {form.formState.errors.postcode && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.postcode.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    {...form.register("country")}
                  />
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedAddress(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="sm:w-auto w-full"
              >
                {isLoading
                  ? "Saving..."
                  : selectedAddress
                  ? "Update Address"
                  : "Add Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
