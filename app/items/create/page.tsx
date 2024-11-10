// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { CldUploadWidget, CldImage } from "next-cloudinary";
// import { createItemAction } from "./actions";
// import { Camera, DollarSign, Clock, Calendar, FileText } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { CreateItemFormData, createItemSchema } from "@/src/db/schema";
// import { zodResolver } from "@hookform/resolvers/zod";

// type UploadResult = {
//   info: {
//     public_id: string;
//   };
//   event: "success";
// };

// export default function CreatePage() {
//   const [imageIds, setImageIds] = useState<string[]>([]);

//   const form = useForm<CreateItemFormData>({
//     resolver: zodResolver(createItemSchema),
//     defaultValues: {
//       name: "",
//       startingPrice: 0,
//       bidInterval: 0,
//       description: "",
//       images: [],
//     },
//   });

//   const onSubmit = async (data: CreateItemFormData) => {
//     if (imageIds.length === 0) {
//       form.setError("images", { message: "At least one image is required" });
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (key !== "images") {
//         formData.append(key, value.toString());
//       }
//     });
//     imageIds.forEach((id) => formData.append("images[]", id));

//     await createItemAction(formData);
//   };
//   const [isImageUploaded, setIsImageUploaded] = useState(false);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     if (!isImageUploaded) {
//       e.preventDefault();
//       alert("Please upload an image before submitting!");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-1 container mx-auto py-12 overflow-y-auto">
//         <Card className="w-full max-w-4xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-center">
//               Add New Listing
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
//               {/* Image Upload Section */}
//               <div>
//                 <Label className="text-lg font-medium">Photos (Max 5)</Label>
//                 <div className="mt-2">
//                   {imageIds.length < 5 && (
//                     <CldUploadWidget
//                       uploadPreset="jzhhmoah"
//                       onSuccess={(result) => {
//                         const uploadResult = result as UploadResult;
//                         setImageIds((prev) => {
//                           if (prev.length > 5) return prev; // Prevent adding more than 5 images
//                           const newImageIds = [
//                             ...prev,
//                             uploadResult.info.public_id,
//                           ];
//                           form.setValue("images", newImageIds);
//                           return newImageIds;
//                         });
//                       }}
//                       onClose={() => {
//                         // Force the widget to close and cleanup any overlay
//                         document.body.style.overflow = "auto";
//                       }}
//                     >
//                       {({ open, close }) => (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             if (imageIds.length > 5) {
//                               // If this upload will reach the limit, setup cleanup
//                               const cleanup = () => {
//                                 close();
//                                 document.body.style.overflow = "auto";
//                                 window.removeEventListener(
//                                   "cloudinary-upload-complete",
//                                   cleanup
//                                 );
//                               };
//                               window.addEventListener(
//                                 "cloudinary-upload-complete",
//                                 cleanup
//                               );
//                             }
//                             open();
//                           }}
//                           disabled={imageIds.length > 5}
//                           className="flex items-center space-x-2"
//                         >
//                           <Camera className="w-4 h-4" />
//                           <span>
//                             {imageIds.length > 5
//                               ? "Maximum images reached"
//                               : `Upload Photos (${imageIds.length}/5)`}
//                           </span>
//                         </Button>
//                       )}
//                     </CldUploadWidget>
//                   )}
//                 </div>

//                 {/* Display uploaded images */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                   {imageIds.map((id) => (
//                     <div key={id} className="relative">
//                       <CldImage
//                         width="400"
//                         height="300"
//                         src={id}
//                         alt="Uploaded image"
//                         className="rounded-lg"
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="sm"
//                         className="absolute top-2 right-2"
//                         onClick={() => {
//                           setImageIds((prev) =>
//                             prev.filter((imgId) => imgId !== id)
//                           );
//                           form.setValue(
//                             "images",
//                             imageIds.filter((imgId) => imgId !== id)
//                           );
//                         }}
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Other form fields with React Hook Form */}
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="name" className="text-lg font-medium">
//                     Listing Name
//                   </Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     required
//                     className="mt-2"
//                     placeholder="Enter listing title"
//                   />
//                 </div>

//                 <div>
//                   <Label
//                     htmlFor="startingPrice"
//                     className="text-lg font-medium"
//                   >
//                     Starting Price
//                   </Label>
//                   <div className="relative mt-2">
//                     <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <Input
//                       id="startingPrice"
//                       name="startingPrice"
//                       type="number"
//                       required
//                       className="pl-10"
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="bidInterval" className="text-lg font-medium">
//                     Bid Interval
//                   </Label>
//                   <div className="relative mt-2">
//                     <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <Input
//                       id="bidInterval"
//                       name="bidInterval"
//                       type="number"
//                       required
//                       className="pl-10"
//                       placeholder="Enter bid interval"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="endDate" className="text-lg font-medium">
//                     End Date
//                   </Label>
//                   <div className="relative mt-2">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <Input
//                       id="endDate"
//                       name="endDate"
//                       type="datetime-local"
//                       required
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="description" className="text-lg font-medium">
//                     Description
//                   </Label>
//                   <div className="relative mt-2">
//                     <FileText className="absolute left-3 top-3 text-gray-400" />
//                     <Textarea
//                       id="description"
//                       name="description"
//                       className="pl-10"
//                       placeholder="Enter detailed description"
//                       rows={5}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <CardFooter className="flex justify-between px-0">
//                 <Button type="submit" disabled={!isImageUploaded}>
//                   Submit Listing
//                 </Button>
//                 <Button type="button" variant="destructive">
//                   Cancel
//                 </Button>
//               </CardFooter>
//             </form>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { createItemAction } from "./actions";
import { Camera, DollarSign, Clock, Calendar, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateItemFormData, createItemSchema } from "@/src/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UploadResult = {
  info: { public_id: string };
  event: "success";
};

export default function CreatePage() {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);

  const form = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      startingPrice: 0,
      bidInterval: 0,
      description: "",
      images: [],
    },
  });

  const {
    formState: { errors, isValid },
  } = form;

  // Update your onSubmit function
  const onSubmit = async (data: CreateItemFormData) => {
    if (imageIds.length === 0) {
      form.setError("images", { message: "At least one image is required" });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images") {
        formData.append(key, value.toString());
      }
    });
    imageIds.forEach((id) => formData.append("images[]", id));

    try {
      const result = await createItemAction(formData);
      if (result && result.id) {
        setNewItemId(result.id);
        setShowSuccessModal(true);
      } else {
        console.error("No item ID returned from creation");
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Failed to create item:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <>
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your listing has been created successfully.</p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/items/${newItemId}`);
                }}
              >
                View Listing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 space-y-4 p-8 pt-6 overflow-y-auto">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Add New Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div>
                  <Label className="text-lg font-medium">Photos (Max 5)</Label>
                  <div className="mt-2">
                    <CldUploadWidget
                      uploadPreset="jzhhmoah"
                      onSuccess={(result) => {
                        const uploadResult = result as UploadResult;
                        setImageIds((prev) => {
                          if (prev.length >= 5) return prev;
                          const newImageIds = [
                            ...prev,
                            uploadResult.info.public_id,
                          ];
                          form.setValue("images", newImageIds);
                          return newImageIds;
                        });
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open()} // Fix: Changed from onClick={(e) => open()}
                          disabled={imageIds.length >= 5}
                          className="flex items-center space-x-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>
                            {imageIds.length >= 5
                              ? "Maximum images reached"
                              : `Upload Photos (${imageIds.length}/5)`}
                          </span>
                        </Button>
                      )}
                    </CldUploadWidget>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {imageIds.map((id) => (
                      <div key={id} className="relative">
                        <CldImage
                          width="400"
                          height="300"
                          src={id}
                          alt="Uploaded image"
                          className="rounded-lg object-cover w-full h-[200px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageIds((prev) =>
                              prev.filter((imgId) => imgId !== id)
                            );
                            form.setValue(
                              "images",
                              imageIds.filter((imgId) => imgId !== id)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Listing Name</Label>
                    <Input
                      {...form.register("name")}
                      placeholder="Enter listing title"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="startingPrice">Starting Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        {...form.register("startingPrice", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.startingPrice && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.startingPrice.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bidInterval">Bid Interval</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        {...form.register("bidInterval", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        className="pl-10"
                        placeholder="Enter bid interval"
                      />
                    </div>
                    {errors.bidInterval && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.bidInterval.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        {...form.register("endDate")}
                        type="datetime-local"
                        className="pl-10"
                      />
                    </div>
                    {errors.endDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400" />
                      <Textarea
                        {...form.register("description")}
                        className="pl-10"
                        placeholder="Enter detailed description"
                        rows={5}
                      />
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="submit"
                    disabled={!isValid || imageIds.length === 0}
                  >
                    Submit Listing
                  </Button>
                  <Button type="button" variant="destructive">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
