'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircleIcon } from '@/lib/utils/icons'

interface ErrorMessage {
  id: string
  message: string
  ruleText?: string
}

interface ErrorsCardProps {
  errors: ErrorMessage[]
}

export function ErrorsCard({ errors }: ErrorsCardProps) {
  return (
    <Card className="bg-card rounded-3xl h-full max-w-full">
      <CardHeader className="flex flex-row items-center justify-between relative pb-4">
        <CardTitle className="flex flex-row items-center">
          <XCircleIcon className="size-6 mr-2" /> Errors Found
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {errors.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No errors reported yet. Run an error check to see results.
          </p>
        ) : (
          <ul className="space-y-3">
            {errors.map(error => (
              <li key={error.id} className="p-3 bg-muted rounded-lg shadow-sm">
                <p className="font-medium text-destructive-foreground">
                  {error.message}
                </p>
                {error.ruleText && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Related rule: {error.ruleText}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
