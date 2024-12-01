import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  CreditCard,
  MapPin,
  Phone,
  User,
  Building,
  Mail,
  Globe,
} from "lucide-react";
import { createClientSupabase } from "@/lib/supabase/client";

const AddressSection = ({
  title,
  name,
  address,
  icon: Icon,
  onEdit,
  addressType,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const prefix = addressType === "primary" ? "" : `${addressType}_`;

  const hasAddress =
    address &&
    Object.entries(address)
      .filter(([key]) => key.startsWith(prefix))
      .some(([_, value]) => value !== null);

  const getAddressValue = (field) => address?.[`${prefix}${field}`];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {hasAddress ? (
                <CardDescription>
                  {getAddressValue("addressLine1")}
                  {getAddressValue("addressLine2") && <br />}
                  {getAddressValue("addressLine2")}
                  <br />
                  {getAddressValue("city")}, {getAddressValue("state")}{" "}
                  {getAddressValue("postcode")}
                  <br />
                  {getAddressValue("country")}
                </CardDescription>
              ) : (
                <CardDescription className="text-muted-foreground">
                  No address added yet
                </CardDescription>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            {hasAddress ? "Edit" : "Add"}
          </Button>
        </div>
      </CardHeader>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {hasAddress ? "Edit" : "Add"} {title}
            </DialogTitle>
            <DialogDescription>
              {hasAddress
                ? "Update your address details below"
                : "Enter your address details below"}
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            initialData={address}
            addressType={addressType}
            onSuccess={() => {
              setIsDialogOpen(false);
              if (onEdit) onEdit();
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const FormField = ({ label, icon: Icon, children, required }) => (
  <div className="space-y-1.5">
    <Label className="flex items-center space-x-2">
      <Icon className="h-4 w-4" />
      <span>
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
    </Label>
    {children}
  </div>
);

const AddressForm = ({ onSuccess, initialData, addressType }) => {
  const [formData, setFormData] = useState({
    [`${addressType}AddressLine1`]:
      initialData?.[`${addressType}AddressLine1`] || "",
    [`${addressType}AddressLine2`]:
      initialData?.[`${addressType}AddressLine2`] || "",
    [`${addressType}City`]: initialData?.[`${addressType}City`] || "",
    [`${addressType}State`]: initialData?.[`${addressType}State`] || "",
    [`${addressType}Postcode`]: initialData?.[`${addressType}Postcode`] || "",
    [`${addressType}Country`]: initialData?.[`${addressType}Country`] || "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClientSupabase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("users")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };

  const prefix = addressType === "primary" ? "Primary" : "Billing";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <FormField label={`${prefix} Address Line 1`} icon={Home} required>
          <Input
            required
            value={formData[`${addressType}AddressLine1`]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${addressType}AddressLine1`]: e.target.value,
              }))
            }
          />
        </FormField>
        <FormField label={`${prefix} Address Line 2`} icon={Building}>
          <Input
            value={formData[`${addressType}AddressLine2`]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${addressType}AddressLine2`]: e.target.value,
              }))
            }
          />
        </FormField>
        <FormField label={`${prefix} City`} icon={MapPin} required>
          <Input
            required
            value={formData[`${addressType}City`]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${addressType}City`]: e.target.value,
              }))
            }
          />
        </FormField>
        <FormField label={`${prefix} State/Province`} icon={MapPin} required>
          <Input
            required
            value={formData[`${addressType}State`]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${addressType}State`]: e.target.value,
              }))
            }
          />
        </FormField>
        <FormField label={`${prefix} Postcode`} icon={MapPin} required>
          <Input
            required
            value={formData[`${addressType}Postcode`]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${addressType}Postcode`]: e.target.value,
              }))
            }
          />
        </FormField>
        <FormField label={`${prefix} Country`} icon={Globe} required>
          <Input
            required
            value={formData[`${addressType}Country`]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [`${addressType}Country`]: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Address"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Addresses = () => {
  const [address, setAddress] = useState(null);
  const supabase = createClientSupabase();

  const fetchAddress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          addressLine1, addressLine2, city, state, postcode, country
          `
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching address:", error);
        return;
      }

      setAddress(data);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="space-y-6">
      {/* <div>
        <h3 className="text-lg font-medium">Addresses</h3>
        <p className="text-sm text-muted-foreground">
          Manage your shipping and billing addresses
        </p>
      </div> */}
      <Separator />
      <Tabs defaultValue="primary" className="w-full p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="primary">Primary Address</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing Address (Coming Soon)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="primary" className="mt-4">
          <AddressSection
            title="Primary Address"
            name="primary"
            address={address}
            icon={Home}
            onEdit={fetchAddress}
            addressType="primary"
          />
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Billing Address Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground">
              The ability to add a separate billing address will be available
              soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Addresses;
