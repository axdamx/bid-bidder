"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createClientSupabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
// import { LoadingModal } from "@/components/LoadingModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingModal } from "../components/LoadingModal";

const userDetailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email(),
  addressLine1: z
    .string()
    .min(5, { message: "Address line 1 must be at least 5 characters" }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  postcode: z
    .string()
    .min(2, { message: "Postcode must be at least 2 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
});

const userRoleSchema = z.object({
  role: z.enum(["seller", "bidder", "both", "none"]),
});

const userProfileSchema = z.object({
  image: z.string().optional(),
  about: z.string(),
  // .min(10, { message: "About must be at least 10 characters" }),
});

export default function OnboardingFlow({
  user,
  onComplete,
  setUser,
}: {
  user: any;
  onComplete: () => void;
  setUser: (user: any) => void;
}) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
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
  const router = useRouter();
  const supabase = createClientSupabase();

  const ProgressSteps = ({ currentStep }: { currentStep: number }) => {
    const steps = ["Details", "Role", "Profile"];
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${
                  index + 1 === currentStep
                    ? "border-primary bg-primary text-white"
                    : index + 1 < currentStep
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
                }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-12 ${
                  index + 1 < currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const userDetailsForm = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      userDetailsForm.setValue("name", user.user_metadata?.full_name || "");
      userDetailsForm.setValue("email", user.email || "");
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
  }, []);

  const userRoleForm = useForm({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: "none",
    },
  });

  const userProfileForm = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      image: user?.image || "",
      about: "",
    },
  });

  const onSubmitDetails = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: data.name,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postcode: data.postcode,
          country: data.country,
        })
        .eq("id", user.id);

      if (error) throw error;
      setStep(2);
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRole = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          role: data.role,
        })
        .eq("id", user.id);

      if (error) throw error;
      setStep(3);
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitProfile = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          image: data.image,
          about: data.about,
          onboardingCompleted: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userData) {
        setUser(userData);
      }

      setAlertState({
        isOpen: true,
        title: "Profile Updated!",
        description:
          "Welcome onboard! You're all set to start using our platform.",
        type: "success",
        action: "complete",
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      setAlertState({
        isOpen: true,
        title: "Error",
        description: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (result: any) => {
    try {
      let imageUrl = result.info.secure_url;

      if (result.info.coordinates?.custom?.[0]) {
        const [x, y, width, height] = result.info.coordinates.custom[0];
        imageUrl = imageUrl.replace(
          "/upload/",
          `/upload/c_crop,x_${x},y_${y},w_${width},h_${height}/c_fill,g_face,w_400,h_400,q_auto/`
        );
      } else {
        imageUrl = imageUrl.replace(
          "/upload/",
          "/upload/c_fill,g_face,w_400,h_400,q_auto/"
        );
      }

      userProfileForm.setValue("image", imageUrl);
      setAlertState({
        isOpen: true,
        title: "Success",
        description: "Profile picture updated successfully",
        type: "success",
        action: "upload",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setAlertState({
        isOpen: true,
        title: "Error",
        description: "Failed to upload profile picture",
        type: "error",
      });
    }
  };

  if (user.onboardingCompleted) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Onboarding Completed</AlertDialogTitle>
            <AlertDialogDescription>
              You have completed the onboarding process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/">
              <AlertDialogAction>Go to Home</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <>
      <LoadingModal isOpen={isPageLoading} message="Loading onboarding..." />
      <AlertDialog
        open={alertState.isOpen}
        onOpenChange={(open) => {
          setAlertState((prev) => ({ ...prev, isOpen: open }));
          if (
            !open &&
            alertState.type === "success" &&
            alertState.action === "complete"
          ) {
            onComplete();
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
      <div className={isPageLoading ? "hidden" : ""}>
        <div className="w-full max-w-4xl mx-auto">
          <div className="border rounded-lg p-6 bg-white">
            <div className="max-h-[80vh] overflow-y-auto px-4">
              <ProgressSteps currentStep={step} />

              {step === 1 && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium">Welcome to Renown!</h3>
                  <span className="text-sm text-muted-foreground">
                    We just need some basic info to get your profile setup.
                    You'll be able to edit this later.
                  </span>

                  <Form {...userDetailsForm}>
                    <form
                      onSubmit={userDetailsForm.handleSubmit(onSubmitDetails)}
                      className="space-y-6"
                    >
                      <FormField
                        control={userDetailsForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userDetailsForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your email"
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Address Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={userDetailsForm.control}
                            name="addressLine1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter your address"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={userDetailsForm.control}
                            name="addressLine2"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 2</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Apartment, suite, etc."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={userDetailsForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter your city"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={userDetailsForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter your state"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={userDetailsForm.control}
                            name="postcode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postcode</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter your postcode"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={userDetailsForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MY">
                                        Malaysia
                                      </SelectItem>
                                      <SelectItem value="SG">
                                        Singapore
                                      </SelectItem>
                                      <SelectItem value="ID">
                                        Indonesia
                                      </SelectItem>
                                      <SelectItem value="TH">
                                        Thailand
                                      </SelectItem>
                                      <SelectItem value="VN">
                                        Vietnam
                                      </SelectItem>
                                      <SelectItem value="PH">
                                        Philippines
                                      </SelectItem>
                                      <SelectItem value="BN">Brunei</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          isLoading ||
                          !userDetailsForm.formState.isValid ||
                          Object.keys(userDetailsForm.formState.dirtyFields)
                            .length === 0
                        }
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Continue
                      </Button>
                    </form>
                  </Form>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium">
                    Tell us about your preferable role in Renown
                  </h3>
                  <Form {...userRoleForm}>
                    <form
                      onSubmit={userRoleForm.handleSubmit(onSubmitRole)}
                      className="space-y-4"
                    >
                      <FormField
                        control={userRoleForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="seller">Seller</SelectItem>
                                <SelectItem value="bidder">Bidder</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="none">
                                  Just Browsing
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            isLoading ||
                            ((!userRoleForm.formState.isValid ||
                              Object.keys(userRoleForm.formState.dirtyFields)
                                .length === 0) &&
                              userRoleForm.getValues("role") !== "none")
                          }
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Continue
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium">Nearly there!</h3>
                  <span className="text-sm text-muted-foreground">
                    Last thing, a brief description about you and a photo really
                    helps you get attention and let people know who they're
                    dealing with.
                  </span>
                  <Form {...userProfileForm}>
                    <form
                      onSubmit={userProfileForm.handleSubmit(onSubmitProfile)}
                      className="space-y-6"
                    >
                      <FormField
                        control={userProfileForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            {/* <FormLabel>Profile Picture</FormLabel> */}
                            <FormControl>
                              <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-32 h-32">
                                  <AvatarImage src={field.value} />
                                  <AvatarFallback>
                                    {user?.user_metadata?.name?.charAt(0) ||
                                      user?.email?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
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
                                      {isLoading
                                        ? "Uploading..."
                                        : "Change Profile Picture"}
                                    </Button>
                                  )}
                                </CldUploadWidget>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userProfileForm.control}
                        name="about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                        >
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            isLoading ||
                            !userProfileForm.formState.isValid ||
                            Object.keys(userProfileForm.formState.dirtyFields)
                              .length === 0
                          }
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Complete
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
