"use client";

import { createClientSupabase } from "@/lib/supabase/client";
import {
  UserDetailsFormData,
  UserRoleFormData,
  UserProfileFormData,
  AlertState,
} from "../types";
import { updateUserAndAddress, updateHasSeenOnboarding } from "../actions";
import { addPayoutMethod } from "../../dashboard/payment/actions";

// Handle user details form submission
export const handleUserDetailsSubmission = async (
  data: UserDetailsFormData,
  userId: string,
  setIsLoading: (value: boolean) => void,
  setStep: (value: number) => void,
  setAlertState: (value: AlertState) => void,
  userDetailsForm: any
) => {
  setIsLoading(true);
  try {
    // Validate all required fields
    let hasError = false;

    // Validate name
    if (data.name.length < 2) {
      userDetailsForm.setError("name", {
        type: "manual",
        message: "Name must be at least 2 characters",
      });
      hasError = true;
    } else {
      userDetailsForm.clearErrors("name");
    }

    // Validate addressLine1
    if (data.addressLine1.length < 5) {
      userDetailsForm.setError("addressLine1", {
        type: "manual",
        message: "Address line 1 must be at least 5 characters",
      });
      hasError = true;
    } else {
      userDetailsForm.clearErrors("addressLine1");
    }

    // Validate city
    if (data.city.length < 2) {
      userDetailsForm.setError("city", {
        type: "manual",
        message: "City must be at least 2 characters",
      });
      hasError = true;
    } else {
      userDetailsForm.clearErrors("city");
    }

    // Validate state
    if (data.state.length < 2) {
      userDetailsForm.setError("state", {
        type: "manual",
        message: "State must be at least 2 characters",
      });
      hasError = true;
    } else {
      userDetailsForm.clearErrors("state");
    }

    // Validate postcode
    if (data.postcode.length < 2) {
      userDetailsForm.setError("postcode", {
        type: "manual",
        message: "Postcode must be at least 2 characters",
      });
      hasError = true;
    } else {
      userDetailsForm.clearErrors("postcode");
    }

    // Validate country
    if (!data.country || data.country.length < 2) {
      userDetailsForm.setError("country", {
        type: "manual",
        message: "Country must be selected",
      });
      hasError = true;
    } else {
      userDetailsForm.clearErrors("country");
    }

    // If any validation errors, stop submission
    if (hasError) {
      setIsLoading(false);
      return;
    }

    const result = await updateUserAndAddress(userId, {
      name: data.name,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || "",
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      country: data.country,
    });

    if (result.error) {
      setAlertState({
        isOpen: true,
        title: "Error",
        description: "Failed to update user details. Please try again.",
        type: "error",
      });
      return;
    }

    setStep(2);
  } catch (error) {
    setAlertState({
      isOpen: true,
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
      type: "error",
    });
  } finally {
    setIsLoading(false);
  }
};

// Handle user role form submission
export const handleUserRoleSubmission = async (
  data: UserRoleFormData,
  userId: string,
  setIsLoading: (value: boolean) => void,
  setStep: (value: number) => void,
  setAlertState: (value: AlertState) => void,
  userRoleForm: any,
  user: any,
  setUser: (user: any) => void
) => {
  setIsLoading(true);
  try {
    // Validate all required fields
    let hasError = false;

    // Validate role
    if (!data.role || data.role === "none") {
      userRoleForm.setError("role", {
        type: "manual",
        message: "Please select a role",
      });
      hasError = true;
    } else {
      userRoleForm.clearErrors("role");
    }

    // Validate bank details
    if (!data.bankName || data.bankName.length < 2) {
      userRoleForm.setError("bankName", {
        type: "manual",
        message: "Bank name must be at least 2 characters",
      });
      hasError = true;
    } else {
      userRoleForm.clearErrors("bankName");
    }

    if (!data.accountNumber || data.accountNumber.length < 5) {
      userRoleForm.setError("accountNumber", {
        type: "manual",
        message: "Account number must be at least 5 characters",
      });
      hasError = true;
    } else {
      userRoleForm.clearErrors("accountNumber");
    }

    if (!data.accountHolder || data.accountHolder.length < 2) {
      userRoleForm.setError("accountHolder", {
        type: "manual",
        message: "Account holder name must be at least 2 characters",
      });
      hasError = true;
    } else {
      userRoleForm.clearErrors("accountHolder");
    }

    if (!data.country || data.country.length < 2) {
      userRoleForm.setError("country", {
        type: "manual",
        message: "Country must be at least 2 characters",
      });
      hasError = true;
    } else {
      userRoleForm.clearErrors("country");
    }

    // If any validation errors, stop submission
    if (hasError) {
      setIsLoading(false);
      return;
    }

    const supabase = createClientSupabase();

    // Update the user's role
    const { data: updatedUser, error: roleError } = await supabase
      .from("users")
      .update({ role: data.role })
      .eq("id", userId)
      .select()
      .single();

    if (roleError) throw roleError;

    // Add payout method
    const payoutMethodResult = await addPayoutMethod(userId, {
      bankName: data.bankName || "",
      accountNumber: data.accountNumber || "",
      accountHolder: data.accountHolder || "",
      country: data.country || "",
    });

    if (payoutMethodResult.error) {
      throw new Error(payoutMethodResult.error);
    }

    setUser({ ...user, ...updatedUser });
    setStep(3);
  } catch (error) {
    setAlertState({
      isOpen: true,
      title: "Error",
      description: "Failed to update role. Please try again.",
      type: "error",
    });
  } finally {
    setIsLoading(false);
  }
};

// Handle user profile form submission
export const handleUserProfileSubmission = async (
  data: UserProfileFormData,
  userId: string,
  setIsLoading: (value: boolean) => void,
  setAlertState: (value: AlertState) => void,
  setUser: (user: any) => void
) => {
  setIsLoading(true);
  try {
    const supabase = createClientSupabase();

    const { error } = await supabase
      .from("users")
      .update({
        image: data.image,
        about: data.about,
        onboardingCompleted: true,
      })
      .eq("id", userId);

    if (error) throw error;

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
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

// Handle profile image upload
export const handleImageUpload = async (
  result: any,
  userProfileForm: any,
  setAlertState: (value: AlertState) => void
) => {
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
    setAlertState({
      isOpen: true,
      title: "Error",
      description: "Failed to upload profile picture",
      type: "error",
    });
  }
};
