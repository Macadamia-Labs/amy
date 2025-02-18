"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

function NotFoundContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const fullUrl = `${pathname}${
    searchParams.size ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="text-lg">Could not find requested resource</p>
      <code className="mt-2 p-2 bg-muted rounded text-sm">{fullUrl}</code>
      <Button className="mt-4" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  );
}
