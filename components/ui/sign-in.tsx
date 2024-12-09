"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModalV2 from "@/app/components/AuthModalV2";

export default function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Login / Sign Up
      </Button>
      <AuthModalV2 isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
