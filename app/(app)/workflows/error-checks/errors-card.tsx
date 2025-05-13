'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircleIcon } from '@/lib/utils/icons'
import { AnimatePresence, motion } from 'framer-motion'

interface ErrorMessage {
  id: string
  message: string
  ruleText?: string
  resourceId?: string
}

interface ErrorsCardProps {
  errors: ErrorMessage[]
}

export function ErrorsCard({ errors }: ErrorsCardProps) {
  const { resources } = useResources()
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
            <AnimatePresence initial={false}>
              {errors.map(error => (
                <motion.li
                  key={error.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.25,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className="p-3 bg-muted rounded-lg shadow-sm flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    {error.ruleText && (
                      <Badge variant="secondary" className="shrink-0">
                        {error.ruleText.match(/Rule (\d+)/)?.[0]}
                      </Badge>
                    )}
                    <p className="font-medium break-words flex-1">
                      {error.message}
                    </p>
                  </div>
                  {error.ruleText && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="sr-only">Related rule: </span>
                      {error.ruleText}
                    </p>
                  )}
                  {error.resourceId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="sr-only">Related resource: </span>
                      {
                        resources.find(
                          resource => resource.id === error.resourceId
                        )?.title
                      }
                    </p>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
