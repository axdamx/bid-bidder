// // // "use client";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogTitle,
// // //   DialogTrigger,
// // // } from "@/components/ui/dialog";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { useState } from "react";

// // // export default function PaymentsAndPayouts() {
// // //   const [paymentMethod, setPaymentMethod] = useState("");

// // //   const handleAddPaymentMethod = () => {
// // //     // Logic for handling payment method addition
// // //     console.log("Payment method added:", paymentMethod);
// // //   };

// // //   return (
// // //     <div className="max-w-2xl mx-auto p-4 mb-5">
// // //       {/* <h2 className="text-2xl font-semibold mb-4">Payments & Payouts</h2> */}

// // //       <Tabs defaultValue="payments">
// // //         <TabsList>
// // //           <TabsTrigger value="payments">Payments</TabsTrigger>
// // //           <TabsTrigger value="payouts">Payouts</TabsTrigger>
// // //         </TabsList>

// // //         <TabsContent value="payments">
// // //           <h3 className="text-lg font-semibold">Your Payments</h3>
// // //           <p>Keep track of all your payments and refunds.</p>
// // //           <Button variant="default" className="mt-4">
// // //             Manage payments
// // //           </Button>
// // //         </TabsContent>

// // //         <TabsContent value="payouts">
// // //           <h3 className="text-lg font-semibold">Your Payouts</h3>
// // //           <p>Manage your payouts and withdrawal settings.</p>
// // //         </TabsContent>
// // //       </Tabs>

// // //       <div className="mt-8">
// // //         <h3 className="text-lg font-semibold">Payment Methods</h3>

// // //         {/* Payment methods would be displayed here */}

// // //         <Dialog>
// // //           <DialogTrigger asChild>
// // //             <Button variant="default" className="mt-4">
// // //               Add payment method
// // //             </Button>
// // //           </DialogTrigger>
// // //           <DialogContent>
// // //             <DialogTitle>Add Payment Method</DialogTitle>
// // //             <DialogDescription>
// // //               Enter the details for your new payment method.
// // //             </DialogDescription>
// // //             <div className="mt-4">
// // //               <Label htmlFor="paymentMethod">Payment Method</Label>
// // //               <Input
// // //                 id="paymentMethod"
// // //                 placeholder="Enter payment method (e.g., Visa, PayPal)"
// // //                 value={paymentMethod}
// // //                 onChange={(e) => setPaymentMethod(e.target.value)}
// // //               />
// // //             </div>
// // //             <Button
// // //               variant="default"
// // //               className="mt-4"
// // //               onClick={handleAddPaymentMethod}
// // //             >
// // //               Save Payment Method
// // //             </Button>
// // //           </DialogContent>
// // //         </Dialog>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // "use client";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Select } from "@/components/ui/select";
// // import React, { useState } from "react";

// // const PaymentsAndPayouts = () => {
// //   const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
// //   const [paymentMethod, setPaymentMethod] = useState({
// //     cardNumber: "",
// //     expiration: "",
// //     cvv: "",
// //     country: "United Kingdom",
// //   });

// //   const handleAddPaymentMethod = () => {
// //     setIsAddPaymentModalOpen(true);
// //   };

// //   const handleCloseAddPaymentModal = () => {
// //     setIsAddPaymentModalOpen(false);
// //   };

// //   const handleSavePaymentMethod = () => {
// //     // Save the payment method to the user's account
// //     console.log("Saving payment method:", paymentMethod);
// //     setIsAddPaymentModalOpen(false);
// //   };

// //   const handleInputChange = (field, value) => {
// //     setPaymentMethod((prevState) => ({
// //       ...prevState,
// //       [field]: value,
// //     }));
// //   };

// //   return (
// //     <Card className="w-full">
// //       <CardHeader>
// //         <CardTitle>Payments & Payouts</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <div className="grid grid-cols-2 gap-6">
// //           <div>
// //             <h3 className="text-lg font-medium mb-4">Your payments</h3>
// //             <p className="mb-4">Keep track of all your payments and refunds.</p>
// //             <Button onClick={handleAddPaymentMethod}>Add payment method</Button>
// //           </div>
// //           <div>
// //             <h3 className="text-lg font-medium mb-4">Payment methods</h3>
// //             <div className="space-y-4">
// //               <div>
// //                 <Label htmlFor="paypal">PayPal</Label>
// //                 <p className="text-gray-500">@gmail.com</p>
// //               </div>
// //               <div>
// //                 <Label htmlFor="visa">Visa</Label>
// //                 <p className="text-gray-500">Expiration: 12/25</p>
// //               </div>
// //             </div>
// //             <Button variant="secondary" className="mt-4">
// //               Add payment method
// //             </Button>
// //           </div>
// //         </div>
// //       </CardContent>
// //       <CardFooter>
// //         <p className="text-gray-500">
// //           Make all payments through Airbnb to ensure you're protected under our
// //           Terms of Service, Payments Terms of Service, cancellation, and other
// //           safeguards.{" "}
// //           <a href="#" className="text-blue-500">
// //             Learn more
// //           </a>
// //         </p>
// //       </CardFooter>

// //       <Dialog
// //         open={isAddPaymentModalOpen}
// //         onOpenChange={setIsAddPaymentModalOpen}
// //       >
// //         <DialogContent>
// //           <DialogHeader>
// //             <CardTitle>Add card details</CardTitle>
// //           </DialogHeader>
// //           <DialogDescription>
// //             <form>
// //               <div className="space-y-4">
// //                 <div>
// //                   <Label htmlFor="cardNumber">Card number</Label>
// //                   <Input
// //                     id="cardNumber"
// //                     value={paymentMethod.cardNumber}
// //                     onChange={(e) =>
// //                       handleInputChange("cardNumber", e.target.value)
// //                     }
// //                     placeholder="Card number"
// //                   />
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <Label htmlFor="expiration">Expiration</Label>
// //                     <Input
// //                       id="expiration"
// //                       value={paymentMethod.expiration}
// //                       onChange={(e) =>
// //                         handleInputChange("expiration", e.target.value)
// //                       }
// //                       placeholder="MM/YY"
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label htmlFor="cvv">CVV</Label>
// //                     <Input
// //                       id="cvv"
// //                       value={paymentMethod.cvv}
// //                       onChange={(e) => handleInputChange("cvv", e.target.value)}
// //                       placeholder="CVV"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="country">Country/region</Label>
// //                   <Select
// //                     id="country"
// //                     value={paymentMethod.country}
// //                     onChange={(e) =>
// //                       handleInputChange("country", e.target.value)
// //                     }
// //                   >
// //                     <option value="United Kingdom">United Kingdom</option>
// //                     <option value="United States">United States</option>
// //                     <option value="Canada">Canada</option>
// //                   </Select>
// //                 </div>
// //               </div>
// //             </form>
// //           </DialogDescription>
// //           <Dialog>
// //             <Button variant="secondary" onClick={handleCloseAddPaymentModal}>
// //               Cancel
// //             </Button>
// //             <Button onClick={handleSavePaymentMethod}>Done</Button>
// //           </Dialog>
// //         </DialogContent>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default PaymentsAndPayouts;

// // "use client";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// // } from "@/components/ui/select";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import React, { useState } from "react";

// // const PaymentsAndPayouts = () => {
// //   const [activeTab, setActiveTab] = useState("payments");
// //   const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
// //   const [paymentMethod, setPaymentMethod] = useState({
// //     cardNumber: "",
// //     expiration: "",
// //     cvv: "",
// //     country: "United Kingdom",
// //   });

// //   const handleAddPaymentMethod = () => {
// //     setIsAddPaymentModalOpen(true);
// //   };

// //   const handleCloseAddPaymentModal = () => {
// //     setIsAddPaymentModalOpen(false);
// //   };

// //   const handleSavePaymentMethod = () => {
// //     // Save the payment method to the user's account
// //     console.log("Saving payment method:", paymentMethod);
// //     setIsAddPaymentModalOpen(false);
// //   };

// //   const handleInputChange = (field, value) => {
// //     setPaymentMethod((prevState) => ({
// //       ...prevState,
// //       [field]: value,
// //     }));
// //   };

// //   const handleCountryChange = (value) => {
// //     handleInputChange("country", value);
// //   };

// //   return (
// //     <Card className="w-full">
// //       <CardHeader>
// //         <CardTitle>Payments & Payouts</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
// //           <TabsList>
// //             <TabsTrigger value="payments">Payments</TabsTrigger>
// //             <TabsTrigger value="payouts">Payouts</TabsTrigger>
// //           </TabsList>
// //           <TabsContent value="payments">
// //             <div>
// //               <h3 className="text-lg font-medium mb-4">Your payments</h3>
// //               <p className="mb-4">
// //                 Keep track of all your payments and refunds.
// //               </p>
// //               <Button onClick={handleAddPaymentMethod}>
// //                 Add payment method
// //               </Button>
// //             </div>
// //             <div className="mt-6">
// //               <h3 className="text-lg font-medium mb-4">Payment methods</h3>
// //               <div className="space-y-4">
// //                 <div>
// //                   <Label htmlFor="paypal">PayPal</Label>
// //                   <p className="text-gray-500">@gmail.com</p>
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="visa">Visa</Label>
// //                   <p className="text-gray-500">Expiration: 12/25</p>
// //                 </div>
// //               </div>
// //               {/* <Button variant="secondary" className="mt-4">
// //                 Add payment method
// //               </Button> */}
// //             </div>
// //           </TabsContent>
// //           <TabsContent value="payouts">
// //             <h3 className="text-lg font-medium mb-4">Your payouts</h3>
// //             <p className="mb-4">
// //               Review your payout history and manage your payout methods.
// //             </p>
// //             <Button onClick={handleAddPaymentMethod}>Add payout method</Button>{" "}
// //           </TabsContent>
// //         </Tabs>
// //       </CardContent>
// //       <CardFooter>
// //         <p className="text-gray-500">
// //           Make all payments through Airbnb to ensure you're protected under our
// //           Terms of Service, Payments Terms of Service, cancellation, and other
// //           safeguards.{" "}
// //           <a href="#" className="text-blue-500">
// //             Learn more
// //           </a>
// //         </p>
// //       </CardFooter>

// //       <Dialog
// //         open={isAddPaymentModalOpen}
// //         onOpenChange={setIsAddPaymentModalOpen}
// //       >
// //         <DialogContent>
// //           <DialogHeader>
// //             <CardTitle>Add card details</CardTitle>
// //           </DialogHeader>
// //           <DialogDescription>
// //             <div className="space-y-4">
// //               <div>
// //                 <Label htmlFor="cardNumber">Card number</Label>
// //                 <Input
// //                   id="cardNumber"
// //                   value={paymentMethod.cardNumber}
// //                   onChange={(e) =>
// //                     handleInputChange("cardNumber", e.target.value)
// //                   }
// //                   placeholder="Card number"
// //                 />
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <Label htmlFor="expiration">Expiration</Label>
// //                   <Input
// //                     id="expiration"
// //                     value={paymentMethod.expiration}
// //                     onChange={(e) =>
// //                       handleInputChange("expiration", e.target.value)
// //                     }
// //                     placeholder="MM/YY"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="cvv">CVV</Label>
// //                   <Input
// //                     id="cvv"
// //                     value={paymentMethod.cvv}
// //                     onChange={(e) => handleInputChange("cvv", e.target.value)}
// //                     placeholder="CVV"
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label htmlFor="country">Country/region</Label>
// //                 {/* <Select
// //                   id="country"
// //                   value={paymentMethod.country}
// //                   onChange={(e) => handleInputChange("country", e.target.value)}
// //                 >
// //                   <option value="United Kingdom">United Kingdom</option>
// //                   <option value="United States">United States</option>
// //                   <option value="Canada">Canada</option>
// //                 </Select> */}
// //                 <Select onValueChange={handleCountryChange}>
// //                   <SelectTrigger id="country">
// //                     {paymentMethod.country}
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="United Kingdom">
// //                       United Kingdom
// //                     </SelectItem>
// //                     <SelectItem value="United States">United States</SelectItem>
// //                     <SelectItem value="Canada">Canada</SelectItem>
// //                     <SelectItem value="Malaysia">Malaysia</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>
// //           </DialogDescription>
// //           <Dialog>
// //             <Button variant="secondary" onClick={handleCloseAddPaymentModal}>
// //               Cancel
// //             </Button>
// //             <Button onClick={handleSavePaymentMethod}>Done</Button>
// //           </Dialog>
// //         </DialogContent>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default PaymentsAndPayouts;

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { CreditCard, PlayIcon, PlusCircle } from "lucide-react";

// export default function PaymentsAndPayouts() {
//   const [activeTab, setActiveTab] = useState("payments");
//   const [paymentMethod, setPaymentMethod] = useState({
//     cardNumber: "",
//     expiration: "",
//     cvv: "",
//     country: "United Kingdom",
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setPaymentMethod((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   const handleSavePaymentMethod = () => {
//     console.log("Saving payment method:", paymentMethod);
//     // Implement the logic to save the payment method
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl">Payments & Payouts</CardTitle>
//         <CardDescription>
//           Manage your payment methods and payout preferences
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-4"
//         >
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="payments">Payments</TabsTrigger>
//             <TabsTrigger value="payouts">Payouts</TabsTrigger>
//           </TabsList>
//           <TabsContent value="payments" className="space-y-4">
//             <div className="grid gap-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">Your Payment Methods</h3>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button variant="outline">
//                       <PlusCircle className="mr-2 h-4 w-4" />
//                       Add Payment Method
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                       <DialogTitle>Add Payment Method</DialogTitle>
//                       <DialogDescription>
//                         Enter your card details to add a new payment method.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="cardNumber">Card number</Label>
//                         <Input
//                           id="cardNumber"
//                           placeholder="1234 5678 9012 3456"
//                           value={paymentMethod.cardNumber}
//                           onChange={(e) =>
//                             handleInputChange("cardNumber", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="grid gap-2">
//                           <Label htmlFor="expiration">Expiration</Label>
//                           <Input
//                             id="expiration"
//                             placeholder="MM/YY"
//                             value={paymentMethod.expiration}
//                             onChange={(e) =>
//                               handleInputChange("expiration", e.target.value)
//                             }
//                           />
//                         </div>
//                         <div className="grid gap-2">
//                           <Label htmlFor="cvv">CVV</Label>
//                           <Input
//                             id="cvv"
//                             placeholder="123"
//                             value={paymentMethod.cvv}
//                             onChange={(e) =>
//                               handleInputChange("cvv", e.target.value)
//                             }
//                           />
//                         </div>
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="country">Country</Label>
//                         <Select
//                           value={paymentMethod.country}
//                           onValueChange={(value) =>
//                             handleInputChange("country", value)
//                           }
//                         >
//                           <SelectTrigger id="country">
//                             <SelectValue placeholder="Select a country" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="United Kingdom">
//                               United Kingdom
//                             </SelectItem>
//                             <SelectItem value="United States">
//                               United States
//                             </SelectItem>
//                             <SelectItem value="Canada">Canada</SelectItem>
//                             <SelectItem value="Malaysia">Malaysia</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button onClick={handleSavePaymentMethod}>
//                         Save Payment Method
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//               <Card>
//                 <CardHeader className="flex flex-row items-center gap-4">
//                   <div className="bg-primary/10 p-2 rounded-full">
//                     <PlayIcon className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <CardTitle>PayPal</CardTitle>
//                     <CardDescription>example@gmail.com</CardDescription>
//                   </div>
//                 </CardHeader>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center gap-4">
//                   <div className="bg-primary/10 p-2 rounded-full">
//                     <CreditCard className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <CardTitle>Visa ending in 1234</CardTitle>
//                     <CardDescription>Expires 12/25</CardDescription>
//                   </div>
//                 </CardHeader>
//               </Card>
//             </div>
//           </TabsContent>
//           <TabsContent value="payouts" className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Your Payout Methods</h3>
//               <Button variant="outline">
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Add Payout Method
//               </Button>
//             </div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Bank Account (USD)</CardTitle>
//                 <CardDescription>Account ending in 5678</CardDescription>
//               </CardHeader>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//       <CardFooter>
//         <p className="text-sm text-muted-foreground">
//           All payments are processed securely through our platform. By using our
//           services, you agree to our{" "}
//           <a href="#" className="text-primary hover:underline">
//             Terms of Service
//           </a>{" "}
//           and{" "}
//           <a href="#" className="text-primary hover:underline">
//             Payments Terms of Service
//           </a>
//           .
//         </p>
//       </CardFooter>
//     </Card>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Building, PlayIcon, PlusCircle } from "lucide-react";

export default function PaymentsAndPayouts() {
  const [activeTab, setActiveTab] = useState("payments");
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    country: "United Kingdom",
  });
  const [payoutMethod, setPayoutMethod] = useState({
    accountType: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    country: "United Kingdom",
  });

  const handlePaymentInputChange = (field: string, value: string) => {
    setPaymentMethod((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePayoutInputChange = (field: string, value: string) => {
    setPayoutMethod((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSavePaymentMethod = () => {
    console.log("Saving payment method:", paymentMethod);
    // Implement the logic to save the payment method
  };

  const handleSavePayoutMethod = () => {
    console.log("Saving payout method:", payoutMethod);
    // Implement the logic to save the payout method
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* <CardHeader> */}
      {/* <CardTitle className="text-2xl">Payments & Payouts</CardTitle>
        <CardDescription>
          Manage your payment methods and payout preferences
        </CardDescription>
      </CardHeader> */}
      {/* <CardContent> */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Payment Methods</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Enter your card details to add a new payment method.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentMethod.cardNumber}
                        onChange={(e) =>
                          handlePaymentInputChange("cardNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiration">Expiration</Label>
                        <Input
                          id="expiration"
                          placeholder="MM/YY"
                          value={paymentMethod.expiration}
                          onChange={(e) =>
                            handlePaymentInputChange(
                              "expiration",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentMethod.cvv}
                          onChange={(e) =>
                            handlePaymentInputChange("cvv", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={paymentMethod.country}
                        onValueChange={(value) =>
                          handlePaymentInputChange("country", value)
                        }
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Malaysia">Malaysia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSavePaymentMethod}>
                      Save Payment Method
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <PlayIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>PayPal</CardTitle>
                  <CardDescription>example@gmail.com</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Visa ending in 1234</CardTitle>
                  <CardDescription>Expires 12/25</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="payouts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Payout Methods</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Payout Method
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Payout Method</DialogTitle>
                  <DialogDescription>
                    Enter your bank account details for payouts.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      value={payoutMethod.accountType}
                      onValueChange={(value) =>
                        handlePayoutInputChange("accountType", value)
                      }
                    >
                      <SelectTrigger id="accountType">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter account number"
                      value={payoutMethod.accountNumber}
                      onChange={(e) =>
                        handlePayoutInputChange("accountNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      placeholder="Enter routing number"
                      value={payoutMethod.routingNumber}
                      onChange={(e) =>
                        handlePayoutInputChange("routingNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="accountHolderName">
                      Account Holder Name
                    </Label>
                    <Input
                      id="accountHolderName"
                      placeholder="Enter account holder name"
                      value={payoutMethod.accountHolderName}
                      onChange={(e) =>
                        handlePayoutInputChange(
                          "accountHolderName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payoutCountry">Country</Label>
                    <Select
                      value={payoutMethod.country}
                      onValueChange={(value) =>
                        handlePayoutInputChange("country", value)
                      }
                    >
                      <SelectTrigger id="payoutCountry">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSavePayoutMethod}>
                    Save Payout Method
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Bank Account (USD)</CardTitle>
                <CardDescription>Account ending in 5678</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
      {/* </CardContent> */}
      <CardFooter className="mt-6">
        <p className="text-sm text-muted-foreground">
          All payments are processed securely through our platform. By using our
          services, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Payments Terms of Service
          </a>
          .
        </p>
      </CardFooter>
    </div>
  );
}
