// disabled typescript for this file
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Camera,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { updateProfilePicture, updateUserField } from "./action";
import { useRouter } from "next/navigation";
import LoadingButton from "@/app/components/LoadingButton";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetOptions,
} from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Add type for User at the top
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  gender?: string;
  phone?: string;
  birthday?: string;
  role?: string;
}

interface CloudinaryCoordinates {
  custom?: number[][];
}

interface CloudinaryUploadWidgetInfoWithCoordinates
  extends CloudinaryUploadWidgetInfo {
  coordinates?: {
    custom?: number[][];
  };
}

interface ExtendedCloudinaryUploadWidgetOptions
  extends CloudinaryUploadWidgetOptions {
  transformation: any;
}

const UserDetailsPage = ({ initialUser }: { initialUser: User }) => {
  const [userData, setUserData] = useState(initialUser);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter
  // const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "success" | "error";
    action?: "complete" | "upload" | undefined;
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "success",
    action: undefined,
  });

  // console.log("user dalam userDetails", userData);
  console.log("user dalam userDetails", user);

  const handleUpload = async (results: CloudinaryUploadWidgetResults) => {
    // console.log("Upload result:", results);
    setIsLoading(true);
    try {
      const result = results.info as CloudinaryUploadWidgetInfoWithCoordinates;
      let imageUrl = result.secure_url;

      // Safely check for custom coordinates
      if (result.coordinates?.custom && result.coordinates.custom.length > 0) {
        const [x, y, width, height] = result.coordinates.custom[0];
        imageUrl = imageUrl.replace(
          "/upload/",
          `/upload/c_crop,x_${x},y_${y},w_${width},h_${height}/c_fill,g_face,w_400,h_400,q_auto/`
        );
      } else {
        // Fallback to basic transformations if no coordinates
        imageUrl = imageUrl.replace(
          "/upload/",
          "/upload/c_fill,g_face,w_400,h_400,q_auto/"
        );
      }

      // console.log("Final image URL:", imageUrl);
      // @ts-ignore
      setProfilePicPreview(imageUrl);
      const updateResult = await updateProfilePicture(userData.id, imageUrl);

      if (updateResult.success) {
        setUserData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            image: imageUrl,
          };
        });
        // toast.success("Profile picture updated successfully");
        setAlertState({
          isOpen: true,
          title: "Success!",
          description: "Profile picture updated successfully",
          type: "success",
          action: "upload",
        });
        setIsDialogOpen(false);
      } else {
        // toast.error("Failed to update profile picture");
        setAlertState({
          isOpen: true,
          title: "Error!",
          description: "Failed to update profile picture",
          type: "error",
          action: "upload",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      // toast.error("An error occurred during upload");
      setAlertState({
        isOpen: true,
        title: "Error!",
        description: "An error occurred during upload",
        type: "error",
        action: "upload",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (field: keyof User) => {
    setEditingField(field);
    setEditValue(userData[field] || "");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserField(
        userData.id,
        editingField,
        editValue
      );

      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          [editingField]: editValue,
        }));
        // toast.success(`${editingField} updated successfully`);
        setAlertState({
          isOpen: true,
          title: "Success!",
          description: `${editingField} updated successfully`,
          type: "success",
          action: "complete",
        });
        setIsDialogOpen(false);
        router.refresh();
        // console.log("result.data", result.data);
        // this is for atom
        setUser((prev) =>
          prev
            ? { ...prev, [editingField]: editValue }
            : ({
                id: "",
                email: "",
                name: "",
                [editingField]: editValue,
              } as User)
        );
        // queryClient.invalidateQueries({ queryKey: ["user"] });
        // window.location.reload(); // Replace router.refresh() with this
      } else {
        // toast.error(result.error || "Failed to update");
        setAlertState({
          isOpen: true,
          title: "Error!",
          description: result.error || "Failed to update",
          type: "error",
          action: "complete",
        });
      }
    } catch (error) {
      // toast.error("An unexpected error occurred");
      setAlertState({
        isOpen: true,
        title: "Error!",
        description: "An unexpected error occurred",
        type: "error",
        action: "complete",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldConfig = {
    personal: {
      title: "Personal Information",
      description: "Manage your personal details",
      fields: {
        name: {
          label: "Name",
          type: "text",
          icon: <User className="h-4 w-4" />,
        },
        gender: {
          label: "Gender",
          type: "select",
          icon: <Users className="h-4 w-4" />,
        },
        birthday: {
          label: "Birthday",
          type: "date",
          icon: <Calendar className="h-4 w-4" />,
        },
      },
    },
    contact: {
      title: "Contact Information",
      description: "Manage your contact details",
      fields: {
        email: {
          label: "Email",
          type: "email",
          icon: <Mail className="h-4 w-4" />,
        },
        phone: {
          label: "Phone",
          type: "tel",
          icon: <Phone className="h-4 w-4" />,
        },
      },
    },
  };

  const renderEditDialog = () => {
    const config = Object.values(fieldConfig)
      .map((section) => section.fields)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {} as Record<string, any>)[
      editingField
    ];

    if (!config) return null;

    return (
      <>
        <AlertDialog
          open={alertState.isOpen}
          onOpenChange={(open) => {
            setAlertState((prev) => ({ ...prev, isOpen: open }));
            if (
              !open &&
              alertState.type === "success" &&
              alertState.action === "complete"
            ) {
              // onComplete();
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {alertState.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Toaster
          toastOptions={{ duration: 3000 }}
          position="bottom-right"
          reverseOrder={false}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit {config.label}</DialogTitle>
              <DialogDescription>
                Make changes to your {config.label.toLowerCase()}. Click save
                when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-field" className="text-right">
                  {config.label}
                </Label>
                {config.type === "select" ? (
                  <Select
                    value={editValue}
                    onValueChange={setEditValue}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue
                        placeholder={`Select ${config.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="edit-field"
                    type={config.type}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="col-span-3"
                    disabled={isLoading}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {/* <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button> */}
              <LoadingButton
                isLoading={isLoading}
                onClick={handleSave}
                loadingText={"Saving..."}
                winnerText={"Done"}
                defaultText={"Save"}
                className="w-fit"
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  // const renderField = (field: string, config: {
  //   icon: React.ReactNode;
  //   label: string
  // }) => (
  //   <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 mb-2">
  //     <div className="flex items-center gap-3">
  //       <div className="p-2 bg-primary/10 rounded-full text-primary">
  //         {config.icon}
  //       </div>
  //       <div>
  //         <Label className="text-sm text-muted-foreground">
  //           {config.label}
  //         </Label>
  //         <div className="font-medium">{userData[field] || "Not set"}</div>
  //       </div>
  //     </div>
  //     {field !== "email" && (
  //       <Button
  //         variant="ghost"
  //         size="icon"
  //         onClick={() => handleEdit(field)}
  //         className="hover:bg-primary/10"
  //       >
  //         <Pencil className="h-4 w-4" />
  //       </Button>
  //     )}
  //   </div>
  // );

  // console.log("profilePicPreview", profilePicPreview);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {/* {(profilePicPreview || userData.image) && (
                <CldImage
                  src={profilePicPreview || userData.image || ""}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  width={150}
                  height={150}
                  crop="fill"
                  gravity="face"
                  quality="auto"
                  preserveTransformations={true}
                />
              )} */}
              <Avatar className="w-32 h-32">
                <AvatarImage src={user?.image} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CldUploadWidget
            uploadPreset="jzhhmoah"
            onSuccess={handleUpload}
            options={{
              maxFiles: 1,
              sources: ["local", "camera"],
              resourceType: "image",
              cropping: true,
              croppingAspectRatio: 1,
              croppingShowDimensions: true,
              croppingValidateDimensions: true,
              croppingShowBackButton: true,
              // transformation: [
              //   {
              //     width: 400,
              //     height: 400,
              //     crop: "fill",
              //     gravity: "face",
              //     quality: "auto",
              //   },
              // ],
              styles: {
                palette: {
                  window: "#FFFFFF",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  menuIcons: "#5A616A",
                  textDark: "#000000",
                  textLight: "#FFFFFF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inactiveTabIcon: "#0E2F5A",
                  error: "#F44235",
                  inProgress: "#0078FF",
                  complete: "#20B832",
                  sourceBg: "#E4EBF1",
                },
              },
            }}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="outline"
                onClick={() => open()}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {isLoading ? "Uploading..." : "Change Profile Picture"}
              </Button>
            )}
          </CldUploadWidget>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Full Name</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("name")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
              {userData.name || "Not set"}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Gender</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("gender")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-gray-700 p-3 bg-gray-50 rounded-lg capitalize">
              {userData.gender || "Not set"}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Phone Number</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("phone")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
              {userData.phone || "Not set"}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Date of birth</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("birthday")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
              {userData.birthday || "Not set"}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Your date of birth is used to calculate your age.
            </p>
          </div>
        </div>

        {/* Edit Dialog - Keep existing dialog component */}
        {renderEditDialog()}
      </div>
    </div>
  );
};

export default UserDetailsPage;
