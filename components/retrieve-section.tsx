'use client'

import { Section, ToolArgsSection } from '@/components/section'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { RetrieveResults } from '@/lib/types'
import { ToolInvocation } from 'ai'
import { useState } from 'react'
import { CollapsibleMessage } from './collapsible-message'
import { DefaultSkeleton } from './default-skeleton'

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
  const data: RetrieveResults =
    tool.state === 'result' ? tool.result : undefined
  const url = tool.args.url as string | undefined

  console.log('RETRIVE TOOL DATA', JSON.stringify(data, null, 2))

  const header = (
    <ToolArgsSection tool="retrieve">
      {url || 'Retrieved Sources'}
    </ToolArgsSection>
  )

  if (data && data.length === 0) {
    return (
      <div className="p-4 rounded bg-muted rounded-xl text-sm text-muted-foreground">
        No relevant sources found
      </div>
    )
  }

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
          <Section title="Sources">
            {data.map((result: any) => (
              <div
                key={result.id}
                className="p-2 mb-2 rounded-md bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedContent(result.content)
                  setDialogOpen(true)
                }}
              >
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {result?.title || result?.resource_id}
                </div>
              </div>
            ))}
          </Section>
        ) : (
          <DefaultSkeleton />
        )}
      </CollapsibleMessage>
    </>
  )
}

export default RetrieveSection
