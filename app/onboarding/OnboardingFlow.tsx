"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CldUploadWidget } from "next-cloudinary";
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
import { updateHasSeenOnboarding } from "./actions";
import { ProgressSteps } from "./components/ProgressSteps";
import { 
  userDetailsSchema, 
  userRoleSchema, 
  userProfileSchema,
  OnboardingFlowProps,
  AlertState,
  UserDetailsFormData,
  UserRoleFormData,
  UserProfileFormData
} from "./types";
import {
  handleUserDetailsSubmission,
  handleUserRoleSubmission,
  handleUserProfileSubmission,
  handleImageUpload
} from "./utils/formHandlers";

export default function OnboardingFlow({
  user,
  onComplete,
  setUser,
}: OnboardingFlowProps) {
  useEffect(() => {
    if (user && !user.hasSeenOnboarding) {
      updateHasSeenOnboarding(user.id);
    }
  }, [user]);


  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: "",
    description: "",
    type: "success",
    action: undefined,
  });

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
  }, [user, userDetailsForm]);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
  }, []);

  const userRoleForm = useForm({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: "none",
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      country: "",
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
    // Type assertion to ensure data matches UserDetailsFormData
    const detailsData: UserDetailsFormData = {
      name: data.name,
      email: data.email,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      country: data.country
    };
    
    await handleUserDetailsSubmission(
      detailsData, 
      user.id, 
      setIsLoading, 
      setStep, 
      setAlertState, 
      userDetailsForm
    );
  };

  const onSubmitRole = async (data: any) => {
    // Type assertion to ensure data matches UserRoleFormData
    const roleData: UserRoleFormData = {
      role: data.role as "seller" | "bidder" | "both" | "none",
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
      country: data.country
    };
    
    await handleUserRoleSubmission(
      roleData,
      user.id,
      setIsLoading,
      setStep,
      setAlertState,
      userRoleForm,
      user,
      setUser
    );
  };

  const onSubmitProfile = async (data: any) => {
    // Type assertion to ensure data matches UserProfileFormData
    const profileData: UserProfileFormData = {
      image: data.image,
      about: data.about
    };
    
    await handleUserProfileSubmission(
      profileData,
      user.id,
      setIsLoading,
      setAlertState,
      setUser
    );
  };

  const handleUpload = async (result: any) => {
    await handleImageUpload(result, userProfileForm, setAlertState);
  };

  return (
    <>
      <LoadingModal
        isOpen={isPageLoading}
        message="Welcome to Renown! Loading..."
      />
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
                <Card>
                  <CardContent className="pt-6 space-y-8">
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
                                <Input
                                  {...field}
                                  placeholder="Enter your name"
                                  onBlur={(e) => {
                                    field.onBlur();
                                    if (e.target.value.length < 2) {
                                      userDetailsForm.setError("name", {
                                        type: "manual",
                                        message:
                                          "Name must be at least 2 characters",
                                      });
                                    } else {
                                      userDetailsForm.clearErrors("name");
                                    }
                                  }}
                                />
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
                          <h3 className="text-lg font-medium">
                            Address Details
                          </h3>
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
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (e.target.value.length < 5) {
                                          userDetailsForm.setError(
                                            "addressLine1",
                                            {
                                              type: "manual",
                                              message:
                                                "Address line 1 must be at least 5 characters",
                                            }
                                          );
                                        } else {
                                          // Clear the error if address is valid
                                          userDetailsForm.clearErrors(
                                            "addressLine1"
                                          );
                                        }
                                      }}
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
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (e.target.value.length < 2) {
                                          userDetailsForm.setError("city", {
                                            type: "manual",
                                            message:
                                              "City must be at least 2 characters",
                                          });
                                        } else {
                                          userDetailsForm.clearErrors("city");
                                        }
                                      }}
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
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (e.target.value.length < 2) {
                                          userDetailsForm.setError("state", {
                                            type: "manual",
                                            message:
                                              "State must be at least 2 characters",
                                          });
                                        } else {
                                          userDetailsForm.clearErrors("state");
                                        }
                                      }}
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
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (e.target.value.length < 2) {
                                          userDetailsForm.setError("postcode", {
                                            type: "manual",
                                            message:
                                              "Postcode must be at least 2 characters",
                                          });
                                        } else {
                                          userDetailsForm.clearErrors(
                                            "postcode"
                                          );
                                        }
                                      }}
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
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        if (!value || value.length < 2) {
                                          userDetailsForm.setError("country", {
                                            type: "manual",
                                            message: "Country must be selected",
                                          });
                                        } else {
                                          userDetailsForm.clearErrors(
                                            "country"
                                          );
                                        }
                                      }}
                                      defaultValue={field.value}
                                      onOpenChange={(open) => {
                                        if (
                                          !open &&
                                          (!field.value ||
                                            field.value.length < 2)
                                        ) {
                                          userDetailsForm.setError("country", {
                                            type: "manual",
                                            message: "Country must be selected",
                                          });
                                        }
                                      }}
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
                                        <SelectItem value="BN">
                                          Brunei
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Display validation errors for all fields */}
                        {userDetailsForm.formState.errors.name && (
                          <div className="text-red-500 text-sm mt-2">
                            {userDetailsForm.formState.errors.name.message}
                          </div>
                        )}
                        {userDetailsForm.formState.errors.addressLine1 && (
                          <div className="text-red-500 text-sm mt-2">
                            {
                              userDetailsForm.formState.errors.addressLine1
                                .message
                            }
                          </div>
                        )}
                        {userDetailsForm.formState.errors.city && (
                          <div className="text-red-500 text-sm mt-2">
                            {userDetailsForm.formState.errors.city.message}
                          </div>
                        )}
                        {userDetailsForm.formState.errors.state && (
                          <div className="text-red-500 text-sm mt-2">
                            {userDetailsForm.formState.errors.state.message}
                          </div>
                        )}
                        {userDetailsForm.formState.errors.postcode && (
                          <div className="text-red-500 text-sm mt-2">
                            {userDetailsForm.formState.errors.postcode.message}
                          </div>
                        )}
                        {userDetailsForm.formState.errors.country && (
                          <div className="text-red-500 text-sm mt-2">
                            {userDetailsForm.formState.errors.country.message}
                          </div>
                        )}
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
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardContent className="pt-6">
                    <Form {...userRoleForm}>
                      <form
                        onSubmit={userRoleForm.handleSubmit(onSubmitRole)}
                        className="space-y-8"
                      >
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold text-center">
                            Choose Your Role
                          </h2>
                          <FormField
                            control={userRoleForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  What would you like to do on our platform?
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (!value || value === "none") {
                                      userRoleForm.setError("role", {
                                        type: "manual",
                                        message: "Please select a role",
                                      });
                                    } else {
                                      userRoleForm.clearErrors("role");
                                    }
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="seller">
                                      I want to sell
                                    </SelectItem>
                                    <SelectItem value="bidder">
                                      I want to bid
                                    </SelectItem>
                                    <SelectItem value="both">
                                      I want to do both
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-4 mt-8">
                            <h2 className="text-2xl font-bold text-center">
                              Enter your default payout method
                            </h2>
                            <p className="text-center text-sm text-muted-foreground">
                              To ease the disbursement method later. You may add
                              more or update later in your dashboard page.
                            </p>

                            <FormField
                              control={userRoleForm.control}
                              name="bankName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bank Name*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your bank name"
                                      {...field}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (
                                          !e.target.value ||
                                          e.target.value.length < 2
                                        ) {
                                          userRoleForm.setError("bankName", {
                                            type: "manual",
                                            message:
                                              "Bank name must be at least 2 characters",
                                          });
                                        } else {
                                          userRoleForm.clearErrors("bankName");
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={userRoleForm.control}
                              name="accountNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Number*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your account number"
                                      {...field}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (
                                          !e.target.value ||
                                          e.target.value.length < 5
                                        ) {
                                          userRoleForm.setError(
                                            "accountNumber",
                                            {
                                              type: "manual",
                                              message:
                                                "Account number must be at least 5 characters",
                                            }
                                          );
                                        } else {
                                          userRoleForm.clearErrors(
                                            "accountNumber"
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={userRoleForm.control}
                              name="accountHolder"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Holder Name*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter account holder name"
                                      {...field}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (
                                          !e.target.value ||
                                          e.target.value.length < 2
                                        ) {
                                          userRoleForm.setError(
                                            "accountHolder",
                                            {
                                              type: "manual",
                                              message:
                                                "Account holder name must be at least 2 characters",
                                            }
                                          );
                                        } else {
                                          userRoleForm.clearErrors(
                                            "accountHolder"
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={userRoleForm.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your country"
                                      {...field}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        if (
                                          !e.target.value ||
                                          e.target.value.length < 2
                                        ) {
                                          userRoleForm.setError("country", {
                                            type: "manual",
                                            message:
                                              "Country must be at least 2 characters",
                                          });
                                        } else {
                                          userRoleForm.clearErrors("country");
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Display validation errors for all fields */}
                        {userRoleForm.formState.errors.role && (
                          <div className="text-red-500 text-sm mt-2">
                            {userRoleForm.formState.errors.role.message}
                          </div>
                        )}
                        {userRoleForm.formState.errors.bankName && (
                          <div className="text-red-500 text-sm mt-2">
                            {userRoleForm.formState.errors.bankName.message}
                          </div>
                        )}
                        {userRoleForm.formState.errors.accountNumber && (
                          <div className="text-red-500 text-sm mt-2">
                            {
                              userRoleForm.formState.errors.accountNumber
                                .message
                            }
                          </div>
                        )}
                        {userRoleForm.formState.errors.accountHolder && (
                          <div className="text-red-500 text-sm mt-2">
                            {
                              userRoleForm.formState.errors.accountHolder
                                .message
                            }
                          </div>
                        )}
                        {userRoleForm.formState.errors.country && (
                          <div className="text-red-500 text-sm mt-2">
                            {userRoleForm.formState.errors.country.message}
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          {/* Previous button disabled to prevent duplicate database entries */}
                          {/* <Button
                        type="button"
                        variant="outline"
                        disabled={true}
                        title="Navigation back is disabled to prevent duplicate entries"
                      >
                        Previous
                      </Button> */}
                          <Button
                            type="submit"
                            disabled={
                              isLoading ||
                              !userRoleForm.getValues("role") ||
                              userRoleForm.getValues("role") === "none" ||
                              !userRoleForm.getValues("bankName") ||
                              !userRoleForm.getValues("accountNumber") ||
                              !userRoleForm.getValues("accountHolder") ||
                              !userRoleForm.getValues("country")
                            }
                          >
                            {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Next
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardContent className="pt-6 space-y-8">
                    <h3 className="text-lg font-medium">Nearly there!</h3>
                    <span className="text-sm text-muted-foreground">
                      Last thing, a brief description about you and a photo
                      really helps you get attention and let people know who
                      they're dealing with.
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
                                    uploadPreset={
                                      process.env
                                        .NEXT_PUBLIC_CLOUDINARY_API_PRESET
                                    }
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
                          {/* Previous button disabled to prevent duplicate database entries */}
                          {/* <Button
                          type="button"
                          variant="outline"
                          disabled={true}
                          title="Navigation back is disabled to prevent duplicate entries"
                        >
                          Previous
                        </Button> */}
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
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
