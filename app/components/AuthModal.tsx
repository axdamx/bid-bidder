"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

type ModalView = "log-in" | "sign-up" | "forgot-password";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function AuthModals({
  isOpen,
  setIsOpen,
  view,
  setView,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  view: ModalView;
  setView: (view: ModalView) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Add this line to use the router
  //   const pathname = usePathname(); // Get the current path
  //   console.log("router", router);
  //   console.log("pathname", pathname);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          console.log("User signed in:", session.user);
          await upsertUser(session.user);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleOAuthSignIn = async () => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        console.error("Error initiating OAuth sign-in:", error.message);
        toast.error("Sign in with Google failed. Please try again.");
      } else if (data?.url) {
        // Redirect the user to the OAuth provider's login page
        window.location.href = data.url;
      } else {
        // console.log("path", pathname);
        // If OAuth sign-in is successful and returns to the app
        toast.success("Sign in with Google successful");
        handleClose();
        // router.replace(pathname); // Redirect and revalidate the original path
        // router.replace(pathname); // Use pathname for redirection
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Sign in with Google failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  async function upsertUser(user: any) {
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking user existence:", selectError.message);
      return;
    }

    if (!existingUser) {
      // Insert new user
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name || user.email,
        image: user.user_metadata.avatar_url,
      });

      if (insertError) {
        console.error("Error inserting user:", insertError.message);
      }
    } else {
      // Only update email and image, preserve existing name
      const { error: updateError } = await supabase
        .from("users")
        .update({
          email: user.email,
          image: user.user_metadata.avatar_url,
          // Remove the name field from here to preserve existing name
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user:", updateError.message);
      }
    }
  }

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleViewChange = (newView: ModalView) => {
    setView(newView);
  };

  const handleClose = () => {
    setIsOpen(false);
    setView("log-in");
  };

  const onSignInSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      toast.success("Sign in successful");
      handleClose();
      //   window.location.href = "/";
      router.refresh(); // Redirect and revalidate the original path
    } catch (error) {
      signInForm.setError("password", { message: "Invalid email or password" });
      console.error("Error signing in:", error);
      toast.error("Sign in failed. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const { error, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      const user = signUpData.session?.user;
      console.log("user signup yo", user);
      if (user) {
        const { data: existingUser, error: selectError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (selectError && selectError.code !== "PGRST116") {
          console.error("Error checking user existence:", selectError.message);
          return;
        }

        if (!existingUser) {
          // Insert new user
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
            image: user.user_metadata.avatar_url,
            // Add any additional fields here
          });

          if (insertError) {
            console.error("Error inserting user:", insertError.message);
          } else {
            console.log("User inserted successfully");
          }
        } else {
          console.log("User already exists");
        }
      }
      toast.success("Sign up successful");
      handleClose();
      router.refresh(); // Redirect and revalidate the original path
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Sign up failed. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      if (error) throw error;
      toast.success(
        "Password reset email sent successfully. Please check your email."
      );
      handleClose();
      router.refresh(); // Redirect and revalidate the original path
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Password reset failed. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.success("Sign in with Google failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Login / Sign Up</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px] lg:max-w-[800px]">
          {view === "log-in" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-4xl">Log In</DialogTitle>
              </DialogHeader>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Form {...signInForm}>
                    <form
                      onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="name@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Log In"
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="relative mt-6 mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground my-4">
                    Or continue with Google
                  </div>

                  <Button
                    variant="outline"
                    className="mb-6"
                    onClick={handleOAuthSignIn}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Google
                  </Button>

                  <div className="mt-6 space-y-2 text-sm">
                    <button
                      onClick={() => handleViewChange("forgot-password")}
                      className="text-primary hover:underline block w-full text-left"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        onClick={() => handleViewChange("sign-up")}
                        className="text-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col justify-center items-center bg-muted p-8 rounded-lg">
                  <div className="max-w-md text-center mb-8">
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-background p-2 rounded-lg">
                          <Zap className="w-8 h-8" />
                        </div>
                        <span className="text-2xl font-bold">Renown</span>
                      </div>
                    </div>
                    <blockquote className="text-2xl font-medium mb-4">
                      "Discover the largest auction marketplace with exclusive,
                      rare finds waiting for your bid."
                    </blockquote>
                    <cite className="text-muted-foreground">
                      Adam - Boss Man of Renown
                    </cite>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === "sign-up" && (
            <>
              <DialogHeader>
                <DialogTitle className="gap-8 text-4xl">Sign Up</DialogTitle>
                {/* <DialogDescription>
                  Enter your email and password to sign up!
                </DialogDescription> */}
              </DialogHeader>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Form {...signUpForm}>
                    <form
                      onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="name@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing up..." : "Sign up"}
                      </Button>
                    </form>
                  </Form>

                  <div className="relative mt-6 mb-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground my-4">
                    Or sign up with Google
                  </div>

                  <Button
                    variant="outline"
                    className="mb-6"
                    onClick={handleOAuthSignIn}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Google
                  </Button>

                  <div className="mt-6 space-y-2 text-sm">
                    <button
                      onClick={() => handleViewChange("forgot-password")}
                      className="text-primary hover:underline block w-full text-left"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        onClick={() => handleViewChange("log-in")}
                        className="text-primary hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col justify-center items-center bg-muted p-8 rounded-lg">
                  <div className="max-w-md text-center mb-8">
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-background p-2 rounded-lg">
                          <Zap className="w-8 h-8" />
                        </div>
                        <span className="text-2xl font-bold">Renown</span>
                      </div>
                    </div>
                    <blockquote className="text-2xl font-medium mb-4">
                      "Discover the largest auction marketplace with exclusive,
                      rare finds waiting for your bid."
                    </blockquote>
                    <cite className="text-muted-foreground">
                      John - BossBaby of Renown
                    </cite>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === "forgot-password" && (
            <>
              <DialogHeader>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogDescription>
                  Enter your email to get a password reset link!
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col">
                <Form {...forgotPasswordForm}>
                  <form
                    onSubmit={forgotPasswordForm.handleSubmit(
                      onForgotPasswordSubmit
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Email"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 space-y-2 text-sm">
                  <button
                    onClick={() => handleViewChange("log-in")}
                    className="text-primary hover:underline block w-full text-left"
                  >
                    Sign in with email and password
                  </button>
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      onClick={() => handleViewChange("sign-up")}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
