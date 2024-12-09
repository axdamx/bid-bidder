"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModals from "@/app/components/AuthModal";
import AuthModalV2 from "@/app/components/AuthModalV2";
import Loading from "@/app/loading";
// import { Button } from "../ui/moving-border";

type ModalView = "log-in" | "sign-up" | "forgot-password";

export default function SignInMobileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>("log-in");

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Login / Sign Up</Button>
      {/* <AuthModals
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        view={view}
        setView={setView}
      /> */}
      <Suspense fallback={<Loading />}>
        <AuthModalV2 isOpen={isOpen} setIsOpen={setIsOpen} />
      </Suspense>
    </>
  );
}
