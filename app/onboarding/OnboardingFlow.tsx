"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";
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

const userDetailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  timezone: z.string(),
});

const userRoleSchema = z.object({
  role: z.enum(["seller", "bidder", "both", "none"]),
});

const userProfileSchema = z.object({
  image: z.string().optional(),
  about: z
    .string()
    .min(10, { message: "About must be at least 10 characters" }),
});

export default function OnboardingFlow({
  user,
  onComplete,
}: {
  user: any;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabase();

  // Add this new component for the progress steps
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
      name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      address: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const userRoleForm = useForm({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: "none",
    },
  });

  const userProfileForm = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      image: user?.user_metadata?.avatar_url || "",
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
          address: data.address,
          timezone: data.timezone,
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
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;
      onComplete();
    } catch (error) {
      console.error("Error updating user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      userProfileForm.setValue("image", publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="w-full max-w-full p-4">
      <ProgressSteps currentStep={step} />

      {/* <Card className="w-full"> */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome! Let's get you set up
            </h2>
            <p className="text-muted-foreground">
              First, we need some basic information about you
            </p>
          </div>

          <Card className="w-full">
            <CardContent className="space-y-6 pt-6">
              <Form {...userDetailsForm}>
                <form
                  onSubmit={userDetailsForm.handleSubmit(onSubmitDetails)}
                  className="space-y-4"
                >
                  <FormField
                    control={userDetailsForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} type="email" disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userDetailsForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userDetailsForm.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Continue
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">How will you use Renown?</h2>
            <p className="text-muted-foreground">
              Select your primary role on the platform
            </p>
          </div>

          <Card className="w-full">
            <CardContent className="space-y-6 pt-6">
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
                            <SelectItem value="none">Just Browsing</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Nearly there!</h2>
            <p className="text-muted-foreground">
              Last thing, a brief description about you and a photo really helps
              you get bookings and let people know who they're booking with.
            </p>
          </div>
          <Card className="w-full">
            <CardContent className="space-y-6 pt-6">
              <Form {...userProfileForm}>
                <form
                  onSubmit={userProfileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={userProfileForm.watch("image")} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="max-w-[200px]"
                    />
                  </div>

                  <FormField
                    control={userProfileForm.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Complete Setup
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
