'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/providers/auth-provider'

export default function WaitingApprovalPage() {
  const { signOut } = useAuth()

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 gap-12">
      <h1 className="text-4xl font-bold font-heading">Macadamia</h1>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Thank you for signing up!</h2>

        <p className="text-muted-foreground">
          Your account is currently pending approval. <br />
          We&apos;ll reach out to you soon to get you started with Macadamia.
        </p>
      </div>

      <Button
        variant="secondary"
        className="w-64 font-bold"
        size="lg"
        onClick={signOut}
      >
        Sign Out
      </Button>
    </div>
  )
}
