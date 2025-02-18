"use client";

import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/providers/auth-provider";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const {
    user,
    signInWithGoogle,
    signInWithOtp,
    verifyOtpCode,
    verifyOtp,
    googleLoading,
    emailLoading,
  } = useAuth();

  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && pathname !== "/request-access") {
      if (!verifyOtp) {
        redirect("/");
      }
    }
  }, [user, pathname, verifyOtp]);

  // Show loading state while we're checking authentication
  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await signInWithOtp(email);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otpCode) return;
    await verifyOtpCode(email, otpCode);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-lg p-8">
        <h1 className="text-center text-2xl font-bold">Log in or sign up</h1>

        <div className="grid gap-4 pt-4 pb-2 w-full">
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center"
            size="lg"
            disabled={googleLoading || loading}
            onClick={handleGoogleLogin}
          >
            {googleLoading || loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Image
                src="/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
                width={20}
                height={20}
              />
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {!verifyOtp ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                className="w-full"
                type="submit"
                disabled={emailLoading || !email}
              >
                {emailLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Send OTP Code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <Input
                  type="text"
                  placeholder="Enter OTP code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={emailLoading || !otpCode}
                >
                  {emailLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Verify OTP Code"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setOtpCode("");
                    signInWithOtp(email);
                  }}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Get ready to accelerate your mechanical engineering...
        </p>
      </div>
    </div>
  );
}
