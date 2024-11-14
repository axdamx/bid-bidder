"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModals from "@/app/components/AuthModal";

type ModalView = "log-in" | "sign-up" | "forgot-password";

export default function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>("log-in");

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Login / Sign Up
      </Button>
      <AuthModals
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        view={view}
        setView={setView}
      />
    </>
  );
}
