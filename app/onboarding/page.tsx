"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "../atom/userAtom";
import OnboardingFlow from "./OnboardingFlow";
import { createClientSupabase } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const supabase = createClientSupabase();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      }
    };
    
    checkUser();
  }, [router]);

  const handleOnboardingComplete = () => {
    router.push("/");
  };

  if (!user) {
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
