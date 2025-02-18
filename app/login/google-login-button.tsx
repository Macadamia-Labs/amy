"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/providers/auth-provider";
import { Loader } from "lucide-react";

export const GoogleLoginButton = () => {
  const { signInWithGoogle, googleLoading } = useAuth();

  return (
    <Button
      id="google-login-button"
      disabled={googleLoading}
      onClick={signInWithGoogle}
      className="w-full"
    >
      {googleLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        "Continue with Google"
      )}
    </Button>
  );
};
