// // "use client";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useState } from "react";

// // export default function PaymentsAndPayouts() {
// //   const [paymentMethod, setPaymentMethod] = useState("");

// //   const handleAddPaymentMethod = () => {
// //     // Logic for handling payment method addition
// //     console.log("Payment method added:", paymentMethod);
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-4 mb-5">
// //       {/* <h2 className="text-2xl font-semibold mb-4">Payments & Payouts</h2> */}

// //       <Tabs defaultValue="payments">
// //         <TabsList>
// //           <TabsTrigger value="payments">Payments</TabsTrigger>
// //           <TabsTrigger value="payouts">Payouts</TabsTrigger>
// //         </TabsList>

// //         <TabsContent value="payments">
// //           <h3 className="text-lg font-semibold">Your Payments</h3>
// //           <p>Keep track of all your payments and refunds.</p>
// //           <Button variant="default" className="mt-4">
// //             Manage payments
// //           </Button>
// //         </TabsContent>

// //         <TabsContent value="payouts">
// //           <h3 className="text-lg font-semibold">Your Payouts</h3>
// //           <p>Manage your payouts and withdrawal settings.</p>
// //         </TabsContent>
// //       </Tabs>

// //       <div className="mt-8">
// //         <h3 className="text-lg font-semibold">Payment Methods</h3>

// //         {/* Payment methods would be displayed here */}

// //         <Dialog>
// //           <DialogTrigger asChild>
// //             <Button variant="default" className="mt-4">
// //               Add payment method
// //             </Button>
// //           </DialogTrigger>
// //           <DialogContent>
// //             <DialogTitle>Add Payment Method</DialogTitle>
// //             <DialogDescription>
// //               Enter the details for your new payment method.
// //             </DialogDescription>
// //             <div className="mt-4">
// //               <Label htmlFor="paymentMethod">Payment Method</Label>
// //               <Input
// //                 id="paymentMethod"
// //                 placeholder="Enter payment method (e.g., Visa, PayPal)"
// //                 value={paymentMethod}
// //                 onChange={(e) => setPaymentMethod(e.target.value)}
// //               />
// //             </div>
// //             <Button
// //               variant="default"
// //               className="mt-4"
// //               onClick={handleAddPaymentMethod}
// //             >
// //               Save Payment Method
// //             </Button>
// //           </DialogContent>
// //         </Dialog>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/select";
// import React, { useState } from "react";

// const PaymentsAndPayouts = () => {
//   const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState({
//     cardNumber: "",
//     expiration: "",
//     cvv: "",
//     country: "United Kingdom",
//   });

//   const handleAddPaymentMethod = () => {
//     setIsAddPaymentModalOpen(true);
//   };

//   const handleCloseAddPaymentModal = () => {
//     setIsAddPaymentModalOpen(false);
//   };

//   const handleSavePaymentMethod = () => {
//     // Save the payment method to the user's account
//     console.log("Saving payment method:", paymentMethod);
//     setIsAddPaymentModalOpen(false);
//   };

//   const handleInputChange = (field, value) => {
//     setPaymentMethod((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Payments & Payouts</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-medium mb-4">Your payments</h3>
//             <p className="mb-4">Keep track of all your payments and refunds.</p>
//             <Button onClick={handleAddPaymentMethod}>Add payment method</Button>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium mb-4">Payment methods</h3>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="paypal">PayPal</Label>
//                 <p className="text-gray-500">@gmail.com</p>
//               </div>
//               <div>
//                 <Label htmlFor="visa">Visa</Label>
//                 <p className="text-gray-500">Expiration: 12/25</p>
//               </div>
//             </div>
//             <Button variant="secondary" className="mt-4">
//               Add payment method
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter>
//         <p className="text-gray-500">
//           Make all payments through Airbnb to ensure you're protected under our
//           Terms of Service, Payments Terms of Service, cancellation, and other
//           safeguards.{" "}
//           <a href="#" className="text-blue-500">
//             Learn more
//           </a>
//         </p>
//       </CardFooter>

//       <Dialog
//         open={isAddPaymentModalOpen}
//         onOpenChange={setIsAddPaymentModalOpen}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <CardTitle>Add card details</CardTitle>
//           </DialogHeader>
//           <DialogDescription>
//             <form>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="cardNumber">Card number</Label>
//                   <Input
//                     id="cardNumber"
//                     value={paymentMethod.cardNumber}
//                     onChange={(e) =>
//                       handleInputChange("cardNumber", e.target.value)
//                     }
//                     placeholder="Card number"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="expiration">Expiration</Label>
//                     <Input
//                       id="expiration"
//                       value={paymentMethod.expiration}
//                       onChange={(e) =>
//                         handleInputChange("expiration", e.target.value)
//                       }
//                       placeholder="MM/YY"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input
//                       id="cvv"
//                       value={paymentMethod.cvv}
//                       onChange={(e) => handleInputChange("cvv", e.target.value)}
//                       placeholder="CVV"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="country">Country/region</Label>
//                   <Select
//                     id="country"
//                     value={paymentMethod.country}
//                     onChange={(e) =>
//                       handleInputChange("country", e.target.value)
//                     }
//                   >
//                     <option value="United Kingdom">United Kingdom</option>
//                     <option value="United States">United States</option>
//                     <option value="Canada">Canada</option>
//                   </Select>
//                 </div>
//               </div>
//             </form>
//           </DialogDescription>
//           <Dialog>
//             <Button variant="secondary" onClick={handleCloseAddPaymentModal}>
//               Cancel
//             </Button>
//             <Button onClick={handleSavePaymentMethod}>Done</Button>
//           </Dialog>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default PaymentsAndPayouts;

"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";

const PaymentsAndPayouts = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    country: "United Kingdom",
  });

  const handleAddPaymentMethod = () => {
    setIsAddPaymentModalOpen(true);
  };

  const handleCloseAddPaymentModal = () => {
    setIsAddPaymentModalOpen(false);
  };

  const handleSavePaymentMethod = () => {
    // Save the payment method to the user's account
    console.log("Saving payment method:", paymentMethod);
    setIsAddPaymentModalOpen(false);
  };

  const handleInputChange = (field, value) => {
    setPaymentMethod((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleCountryChange = (value) => {
    handleInputChange("country", value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payments & Payouts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>
          <TabsContent value="payments">
            <div>
              <h3 className="text-lg font-medium mb-4">Your payments</h3>
              <p className="mb-4">
                Keep track of all your payments and refunds.
              </p>
              <Button onClick={handleAddPaymentMethod}>
                Add payment method
              </Button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Payment methods</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paypal">PayPal</Label>
                  <p className="text-gray-500">@gmail.com</p>
                </div>
                <div>
                  <Label htmlFor="visa">Visa</Label>
                  <p className="text-gray-500">Expiration: 12/25</p>
                </div>
              </div>
              {/* <Button variant="secondary" className="mt-4">
                Add payment method
              </Button> */}
            </div>
          </TabsContent>
          <TabsContent value="payouts">
            <h3 className="text-lg font-medium mb-4">Your payouts</h3>
            <p className="mb-4">
              Review your payout history and manage your payout methods.
            </p>
            <Button onClick={handleAddPaymentMethod}>Add payout method</Button>{" "}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-gray-500">
          Make all payments through Airbnb to ensure you're protected under our
          Terms of Service, Payments Terms of Service, cancellation, and other
          safeguards.{" "}
          <a href="#" className="text-blue-500">
            Learn more
          </a>
        </p>
      </CardFooter>

      <Dialog
        open={isAddPaymentModalOpen}
        onOpenChange={setIsAddPaymentModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <CardTitle>Add card details</CardTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  value={paymentMethod.cardNumber}
                  onChange={(e) =>
                    handleInputChange("cardNumber", e.target.value)
                  }
                  placeholder="Card number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiration">Expiration</Label>
                  <Input
                    id="expiration"
                    value={paymentMethod.expiration}
                    onChange={(e) =>
                      handleInputChange("expiration", e.target.value)
                    }
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={paymentMethod.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    placeholder="CVV"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country/region</Label>
                {/* <Select
                  id="country"
                  value={paymentMethod.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </Select> */}
                <Select onValueChange={handleCountryChange}>
                  <SelectTrigger id="country">
                    {paymentMethod.country}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogDescription>
          <Dialog>
            <Button variant="secondary" onClick={handleCloseAddPaymentModal}>
              Cancel
            </Button>
            <Button onClick={handleSavePaymentMethod}>Done</Button>
          </Dialog>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PaymentsAndPayouts;
