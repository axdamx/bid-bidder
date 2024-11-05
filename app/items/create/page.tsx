// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { createItemAction } from "./actions";
// import { CldUploadWidget, CldImage } from "next-cloudinary";
// import { useState } from "react";

// type UploadResult = {
//   info: {
//     public_id: string;
//   };
//   event: "success";
// };

// export default function CreatePage() {
//   const [imageId, setImageId] = useState<string | null>(null);
//   const [isImageUploaded, setIsImageUploaded] = useState(false); // Track upload status

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     if (!isImageUploaded) {
//       e.preventDefault(); // Prevent form submission if image is not uploaded
//       alert("Please upload an image before submitting!");
//     }
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen py-12">
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
//         <h1 className="text-4xl font-bold mb-4 text-center">Add New Listing</h1>
//         <form
//           className="w-full"
//           action={createItemAction}
//           method="POST"
//           onSubmit={handleSubmit}
//         >
//           {/* Photo Upload Section */}
//           <div className="mb-6">
//             <h2 className="text-xl font-medium mb-2">Photo Upload</h2>

//             <CldUploadWidget
//               uploadPreset="jzhhmoah"
//               onSuccess={(results) => {
//                 setImageId(results?.info?.public_id); // Set image ID when upload is successful
//                 setIsImageUploaded(true); // Enable form submission after upload
//               }}
//             >
//               {({ open }) => {
//                 return (
//                   <Button
//                     type="button" // Important to set this button type to avoid form submission
//                     className="ml-4"
//                     onClick={() => open()}
//                   >
//                     Upload Photos
//                   </Button>
//                 );
//               }}
//             </CldUploadWidget>

//             {imageId && (
//               <CldImage
//                 width="960"
//                 height="600"
//                 src={imageId}
//                 sizes="100vw"
//                 alt="Uploaded image"
//               />
//             )}
//           </div>

//           {/* Vehicle Description Section */}
//           <p className="text-sm text-muted-foreground mb-2">Listing Name</p>
//           <Input
//             required
//             className="max-w-lg mb-4"
//             name="name"
//             // placeholder="Listing Title"
//           />
//           <p className="text-sm text-muted-foreground mb-2">Starting Price</p>

//           <Input
//             required
//             className="max-w-lg mb-4"
//             name="startingPrice"
//             type="number"
//             // placeholder="Starting Bid"
//           />
//           <p className="text-sm text-muted-foreground mb-2">Bid Interval</p>

//           <Input
//             required
//             className="max-w-lg mb-4"
//             name="bidInterval"
//             type="number"
//             // placeholder="Interval"
//           />
//           <p className="text-sm text-muted-foreground mb-2">End Date</p>

//           <Input
//             required
//             className="max-w-lg mb-4"
//             name="endDate"
//             type="datetime-local" // For both date and time input
//             // placeholder="End Date and Time"
//           />

//           <p className="text-sm text-muted-foreground mb-2">Description</p>

//           <Textarea
//             className="max-w-lg mb-4"
//             name="description"
//             // placeholder="Extended Description"
//           />

//           {/* Hidden input to include the imageId in form submission */}
//           <input type="hidden" name="imageId" value={imageId || ""} />

//           {/* Buttons */}
//           <div className="flex justify-between">
//             <Button type="submit" disabled={!isImageUploaded}>
//               Submit Listing
//             </Button>
//             {/* <Button type="button" variant="secondary">
//             Save as Draft
//           </Button> */}
//             <Button type="button" variant="destructive">
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { createItemAction } from "./actions";
import { Camera, DollarSign, Clock, Calendar, FileText } from "lucide-react";

type UploadResult = {
  info: {
    public_id: string;
  };
  event: "success";
};

export default function CreatePage() {
  const [imageId, setImageId] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isImageUploaded) {
      e.preventDefault();
      alert("Please upload an image before submitting!");
    }
  };

  return (
    <main className="container mx-auto py-12">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Add New Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-8"
            action={createItemAction}
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo-upload" className="text-lg font-medium">
                  Photo Upload
                </Label>
                <div className="mt-2">
                  <CldUploadWidget
                    uploadPreset="jzhhmoah"
                    onSuccess={(results) => {
                      const result = results as UploadResult;
                      setImageId(result.info.public_id);
                      setIsImageUploaded(true);
                    }}
                  >
                    {({ open }) => (
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open()}
                          className="flex items-center space-x-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Upload Photos</span>
                        </Button>
                        {imageId && (
                          <p className="text-sm text-muted-foreground">
                            Image uploaded successfully
                          </p>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
                {imageId && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <CldImage
                      width="960"
                      height="600"
                      src={imageId}
                      sizes="100vw"
                      alt="Uploaded image"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="name" className="text-lg font-medium">
                  Listing Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="mt-2"
                  placeholder="Enter listing title"
                />
              </div>

              <div>
                <Label htmlFor="startingPrice" className="text-lg font-medium">
                  Starting Price
                </Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="startingPrice"
                    name="startingPrice"
                    type="number"
                    required
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bidInterval" className="text-lg font-medium">
                  Bid Interval
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="bidInterval"
                    name="bidInterval"
                    type="number"
                    required
                    className="pl-10"
                    placeholder="Enter bid interval"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endDate" className="text-lg font-medium">
                  End Date
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-lg font-medium">
                  Description
                </Label>
                <div className="relative mt-2">
                  <FileText className="absolute left-3 top-3 text-gray-400" />
                  <Textarea
                    id="description"
                    name="description"
                    className="pl-10"
                    placeholder="Enter detailed description"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <input type="hidden" name="imageId" value={imageId || ""} />

            <CardFooter className="flex justify-between px-0">
              <Button type="submit" disabled={!isImageUploaded}>
                Submit Listing
              </Button>
              <Button type="button" variant="destructive">
                Cancel
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
