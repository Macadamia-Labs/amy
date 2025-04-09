'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { CheckCircleIcon, SearchIcon } from '@/lib/utils/icons'
import { ToolInvocation } from 'ai'
import { useState } from 'react'
import { CollapsibleMessage } from './collapsible-message'
import { DefaultSkeleton } from './default-skeleton'
import { TextShimmer } from './ui/text-shimmer'

interface RetrieveSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function RetrieveSection({
  tool,
  isOpen,
  onOpenChange
}: RetrieveSectionProps) {
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isLoading = tool.state === 'call'
  const data: any = tool.state === 'result' ? tool.result : undefined
  const query = tool.args.query as string

  console.log('RETRIVE TOOL DATA', JSON.stringify(data, null, 2))

  const header = isLoading ? (
    <div className="flex items-center gap-2">
      <SearchIcon className="size-4" />
      <div>
        <TextShimmer className="text-sm">
          {`Finding options for: ${query}`}
        </TextShimmer>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <CheckCircleIcon className="size-4" />
      <div>
        <p className="text-sm">Found {data.length} options</p>
      </div>
    </div>
  )

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Source Content</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert">{selectedContent}</div>
        </DialogContent>
      </Dialog>

      <CollapsibleMessage
        role="assistant"
        isCollapsible={true}
        header={header}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        {!isLoading && data ? (
          <div className="flex flex-col gap-2">
            {data.map((result: any) => (
              <div
                key={result.id}
                className="w-full p-2 rounded bg-muted px-4 text-sm"
              >
                <p>{result.name}</p>
                <p className="text-muted-foreground">{result.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <DefaultSkeleton />
        )}
      </CollapsibleMessage>
    </>
  )
}

export default RetrieveSection
