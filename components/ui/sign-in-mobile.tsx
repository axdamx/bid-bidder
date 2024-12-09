"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModals from "@/app/components/AuthModal";
import AuthModalV2 from "@/app/components/AuthModalV2";
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
      <AuthModalV2 isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
