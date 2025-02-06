"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase/client";
import { useAtom } from "jotai";
import { userAtom } from "../atom/userAtom";

const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthModalV2({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientSupabase();
  const [user, setUser] = useAtom(userAtom);

  // useEffect(() => {
  //   const handleAuthStateChange = async (event: string, session: any) => {
  //     if (session?.user) {
  //       console.log("Auth state changed:", event, session.user);
  //       try {
  //         if (!user) {
  //           upsertUser(session.user);
  //         }
  //         // const upsertedUser = await upsertUser(session.user);
  //         // setUser(upsertedUser);
  //         handleClose();
  //         router.refresh();
  //       } catch (error) {
  //         console.error("Error handling auth state change:", error);
  //         toast.error("Failed to update user data");
  //       }
  //     }
  //   };

  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     handleAuthStateChange
  //   );

  //   // Check for auth success/error parameters
  //   const authSuccess = searchParams.get("auth-success");
  //   const authError = searchParams.get("auth-error");
  //   const accountExists = searchParams.get("account-exists");

  //   if (authSuccess === "true") {
  //     if (accountExists === "true") {
  //       toast.success(
  //         "Signed in! Note: An account with this email already exists."
  //       );
  //     } else {
  //       toast.success("Successfully signed in!");
  //     }
  //     // Remove the parameters from the URL without triggering a refresh
  //     const newUrl = new URL(window.location.href);
  //     newUrl.searchParams.delete("auth-success");
  //     newUrl.searchParams.delete("account-exists");
  //     window.history.replaceState({}, "", newUrl.toString());
  //   } else if (authError === "true") {
  //     toast.error("Authentication failed. Please try again.");
  //     const newUrl = new URL(window.location.href);
  //     newUrl.searchParams.delete("auth-error");
  //     window.history.replaceState({}, "", newUrl.toString());
  //   }

  //   // Check current session on mount
  //   const checkSession = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (session?.user) {
  //       await handleAuthStateChange("INITIAL_SESSION", session);
  //     }
  //   };

  //   checkSession();

  //   return () => {
  //     authListener?.subscription.unsubscribe();
  //   };
  // }, [searchParams]);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      // @ts-ignore
      (event, session) => {
        if (session?.user) {
          console.log("User signed in:", session.user);
          // This call is necessary on every session change (including rehydration)
          // to keep the local state (userAtom) in sync with the session
          // Without this, your app would lose user state on refresh
          if (!user) {
            upsertUser(session.user);
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setMagicLinkSent(false);
    form.reset();
  };

  const handleOAuthSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (googleError) {
        console.error("Error initiating OAuth sign-in:", googleError.message);
        toast.error("Sign in with Google failed. Please try again.");
        setIsGoogleLoading(false);
        return;
      }

      // Check if data has a user property
      if (data && "user" in data) {
        // Handle successful sign-in
        console.log("Signed in user:", data.user);
      } else {
        // Handle case where user is not present
        console.log("No user data returned from OAuth sign-in");
        // toast.error("Sign in did not return user information.");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Sign in with Google failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsMagicLinkLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.log("Error message:", error.message);
        setErrorMessage(error.message);
        throw error;
      }

      setMagicLinkSent(true);
      setErrorMessage(""); // Clear error message on success
      toast.success("Magic link sent to your email!");
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleRetry = () => {
    setShowErrorDialog(false);
  };

  const handleError = (error: string) => {
    if (
      error.includes("access_denied") &&
      error.includes("Email link is invalid or has expired")
    ) {
      setShowErrorDialog(true);
    }
  };

  async function upsertUser(user: any) {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching user:", fetchError.message);
        throw fetchError;
      }

      const userData = existingUser
        ? {
            ...existingUser,
            email: user.email,
          }
        : {
            id: user.id,
            email: user.email,
            name: user.user_metadata.name || user.email,
            image: user.user_metadata.avatar_url,
            createdAt: user.created_at,
          };

      const { data: upsertedUser, error: upsertError } = await supabase
        .from("users")
        .upsert(userData, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (upsertError) {
        console.error("Error upserting user:", upsertError.message);
        throw upsertError;
      }

      setUser(upsertedUser);

      if (!existingUser) {
        router.push("/onboarding");
        return upsertedUser;
      }

      if (
        !existingUser.onboardingCompleted &&
        !existingUser.hasSeenOnboarding
      ) {
        router.push("/onboarding");
      }

      return upsertedUser;
    } catch (error) {
      console.error("Error in upsertUser:", error);
      throw error;
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {magicLinkSent ? "Check your email" : "Welcome"}
            </DialogTitle>
            <DialogDescription>
              {magicLinkSent
                ? "We've sent you a magic link to sign in."
                : "Sign in or create an account to continue"}
            </DialogDescription>
          </DialogHeader>

          {!magicLinkSent ? (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        {errorMessage && (
                          <div
                            className="error-message"
                            style={{ color: "red", marginTop: "8px" }}
                          >
                            {errorMessage}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isMagicLinkLoading}
                  >
                    {isMagicLinkLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Send Magic Link"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleOAuthSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="github"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Google
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Check your email for the magic link. You can close this window.
              </p>
              {/* <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMagicLinkSent(false);
                  form.reset();
                }}
              >
                Send another link
              </Button> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
