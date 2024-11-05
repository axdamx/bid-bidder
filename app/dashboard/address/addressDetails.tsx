// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from "@/components/ui/select";
// // Adjust imports as necessary

// const AddressSection = ({ title, name, addressLines }) => {
//   return (
//     <div className="flex justify-between items-start w-full">
//       <div>
//         <h2 className="font-semibold text-lg mb-2">{title}</h2>
//         <p className="font-medium mb-1">{name}</p>
//         {addressLines.map((line, index) => (
//           <p key={index} className="text-gray-700">
//             {line}
//           </p>
//         ))}
//       </div>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button
//             variant="link"
//             className="text-sm text-gray-500 hover:text-gray-700 ml-4"
//           >
//             Change
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-lg p-6 rounded-lg shadow-lg">
//           <DialogTitle className="font-semibold text-lg mb-2">
//             Add New Address
//           </DialogTitle>
//           <DialogDescription className="text-sm text-gray-500 mb-6">
//             * Required Fields
//           </DialogDescription>
//           <AddressForm />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// const AddressForm = () => {
//   const [address, setAddress] = useState({
//     firstName: "",
//     lastName: "",
//     contactNumber: "",
//     addressLine1: "United Kingdom",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postcode: "",
//     country: "United Kingdom",
//   });

//   const handleInputChange = (field, value) => {
//     setAddress((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };
//   const handleCountryChange = (value) => {
//     handleInputChange("country", value);
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <Label htmlFor="firstName">First Name*</Label>
//         <Input
//           id="firstName"
//           placeholder="Mohd"
//           value={address.firstName}
//           onChange={(e) => handleInputChange("firstName", e.target.value)}
//         />
//       </div>
//       <div>
//         <Label htmlFor="lastName">Last Name*</Label>
//         <Input
//           id="lastName"
//           placeholder="Adam"
//           value={address.lastName}
//           onChange={(e) => handleInputChange("lastName", e.target.value)}
//         />
//       </div>
//       <div>
//         <Label htmlFor="contactNumber">Contact Number*</Label>
//         <Input
//           id="contactNumber"
//           placeholder="We'll only contact you regarding your order"
//           value={address.contactNumber}
//           onChange={(e) => handleInputChange("contactNumber", e.target.value)}
//         />
//       </div>
//       <div>
//         <Label htmlFor="addressLine1">Address Line 1*</Label>
//         <Input
//           id="addressLine1"
//           placeholder="Enter your address"
//           value={address.addressLine1}
//           onChange={(e) => handleInputChange("addressLine1", e.target.value)}
//         />
//       </div>
//       <div>
//         <Label htmlFor="addressLine2">Address Line 2</Label>
//         <Input
//           id="addressLine2"
//           placeholder="Optional"
//           value={address.addressLine2}
//           onChange={(e) => handleInputChange("addressLine2", e.target.value)}
//         />
//       </div>
//       <div className="flex gap-4">
//         <div className="flex-1">
//           <Label htmlFor="city">Town / City*</Label>
//           <Input
//             id="city"
//             placeholder="Enter city"
//             value={address.city}
//             onChange={(e) => handleInputChange("city", e.target.value)}
//           />
//         </div>
//         <div className="flex-1">
//           <Label htmlFor="state">State / Province / County</Label>
//           <Input
//             id="state"
//             placeholder="Optional"
//             value={address.state}
//             onChange={(e) => handleInputChange("state", e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="flex gap-4">
//         <div className="flex-1">
//           <Label htmlFor="postcode">Postcode*</Label>
//           <Input
//             id="postcode"
//             placeholder="Enter postcode"
//             value={address.postcode}
//             onChange={(e) => handleInputChange("postcode", e.target.value)}
//           />
//         </div>
//         <div className="flex-1">
//           <Label htmlFor="country">Country*</Label>
//           <Select onValueChange={handleCountryChange}>
//             <SelectTrigger id="country">{address.country}</SelectTrigger>
//             <SelectContent>
//               <SelectItem value="United Kingdom">United Kingdom</SelectItem>
//               <SelectItem value="United States">United States</SelectItem>
//               <SelectItem value="Canada">Canada</SelectItem>
//               <SelectItem value="Malaysia">Malaysia</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <Button variant="default" className="w-full mt-6">
//         Save Address
//       </Button>
//     </div>
//   );
// };

// const Addresses = () => {
//   const shippingAddress = {
//     title: "Shipping Address",
//     name: "MOHAMMAD ADAM",
//     addressLines: [
//       "Emerald 9 Cheras",
//       "Block B, Persiaran Awana",
//       "Cheras",
//       "Selangor",
//       "43200",
//       "Malaysia",
//     ],
//   };

//   const billingAddress = {
//     title: "Billing Address",
//     name: "Mohd Adam",
//     addressLines: [
//       "No 15, Jalan Intan 6",
//       "Taman Cheras Permata 2",
//       "Cheras",
//       "43200",
//       "Malaysia",
//     ],
//   };

//   return (
//     <div className="max-w-lg mx-auto space-y-8 p-4 bg-white rounded-lg shadow mb-5">
//       {/* Shipping Address */}
//       <AddressSection {...shippingAddress} />

//       {/* Separator */}
//       <Separator className="my-4" />

//       {/* Billing Address */}
//       <AddressSection {...billingAddress} />
//     </div>
//   );
// };

// export default Addresses;

import { useState } from "react";
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

const AddressSection = ({ title, name, addressLines, icon: Icon }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <CardDescription>
                Manage your {title.toLowerCase()}
              </CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Update {title}</DialogTitle>
                <DialogDescription>
                  Make changes to your {title.toLowerCase()}. Required fields
                  are marked with an asterisk (*).
                </DialogDescription>
              </DialogHeader>
              <AddressForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 rounded-lg bg-muted p-4">
          <p className="font-medium text-primary">{name}</p>
          {addressLines.map((line, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {line}
            </p>
          ))}
        </div>
      </CardContent>
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

const AddressForm = ({ onSuccess }) => {
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postcode: "",
    country: "United Kingdom",
  });

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name" icon={User} required>
          <Input
            placeholder="Enter first name"
            value={address.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </FormField>
        <FormField label="Last Name" icon={User} required>
          <Input
            placeholder="Enter last name"
            value={address.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Contact Number" icon={Phone} required>
        <Input
          placeholder="We'll only contact you regarding your order"
          value={address.contactNumber}
          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
        />
      </FormField>

      <FormField label="Address Line 1" icon={Building} required>
        <Input
          placeholder="Enter your address"
          value={address.addressLine1}
          onChange={(e) => handleInputChange("addressLine1", e.target.value)}
        />
      </FormField>

      <FormField label="Address Line 2" icon={Building}>
        <Input
          placeholder="Optional"
          value={address.addressLine2}
          onChange={(e) => handleInputChange("addressLine2", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Town / City" icon={MapPin} required>
          <Input
            placeholder="Enter city"
            value={address.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </FormField>
        <FormField label="State / Province" icon={MapPin}>
          <Input
            placeholder="Optional"
            value={address.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Postcode" icon={Mail} required>
          <Input
            placeholder="Enter postcode"
            value={address.postcode}
            onChange={(e) => handleInputChange("postcode", e.target.value)}
          />
        </FormField>
        <FormField label="Country" icon={Globe} required>
          <Select
            value={address.country}
            onValueChange={(value) => handleInputChange("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Malaysia">Malaysia</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <DialogFooter>
        <Button type="submit" className="w-full">
          Save Address
        </Button>
      </DialogFooter>
    </form>
  );
};

const Addresses = () => {
  const addresses = {
    shipping: {
      title: "Shipping Address",
      name: "MOHAMMAD ADAM",
      addressLines: [
        "Emerald 9 Cheras",
        "Block B, Persiaran Awana",
        "Cheras",
        "Selangor",
        "43200",
        "Malaysia",
      ],
      icon: Home,
    },
    billing: {
      title: "Billing Address",
      name: "Mohd Adam",
      addressLines: [
        "No 15, Jalan Intan 6",
        "Taman Cheras Permata 2",
        "Cheras",
        "43200",
        "Malaysia",
      ],
      icon: CreditCard,
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Addresses</CardTitle>
          <CardDescription>
            Update your shipping and billing addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping">Shipping Address</TabsTrigger>
              <TabsTrigger value="billing">Billing Address</TabsTrigger>
            </TabsList>
            <TabsContent value="shipping" className="mt-4">
              <AddressSection {...addresses.shipping} />
            </TabsContent>
            <TabsContent value="billing" className="mt-4">
              <AddressSection {...addresses.billing} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Addresses;
