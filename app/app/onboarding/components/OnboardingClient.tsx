"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { createClientSupabase } from "@/lib/supabase/client";
import OnboardingFlow from "../OnboardingFlow";
import { userAtom } from "@/app/atom/userAtom";

export function OnboardingClient() {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const supabase = createClientSupabase();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          router.replace("/");
          return;
        }

        setIsAuthChecked(true);
      } catch (error) {
        if (mounted) {
          router.replace("/");
        }
      }
    };

    checkUser();

    return () => {
      mounted = false;
    };
  }, [router, supabase.auth]);

  const handleOnboardingComplete = () => {
    router.push("/app");
  };

  // Only render content when both auth is checked and user exists
  if (!isAuthChecked || !user) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <OnboardingFlow
        user={user}
        onComplete={handleOnboardingComplete}
        setUser={setUser}
      />
    </div>
  );
}
