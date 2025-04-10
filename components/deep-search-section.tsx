'use client'

import { Message, ToolInvocation } from 'ai'
import { useState } from 'react'

interface DeepSearchSectionProps {
  message: Message
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DeepSearchSection({
  message,
  tool,
  isOpen,
  onOpenChange
}: DeepSearchSectionProps) {
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isLoading = tool.state === 'call'
  const data: any = tool.state === 'result' ? tool.result : undefined
  const query = tool.args.query as string
  const resourceIds = tool.args.resource_ids as string[]

  return (
    <div className="flex flex-col gap-1 w-full border bg-muted rounded-lg p-2">
      <div className="flex items-center justify-between">
        <p className="font-bold">Deep Search</p>
        <p className="text-sm text-muted-foreground">
          searching for {resourceIds.length} resources
        </p>
      </div>
      {/* <Progress value={50} /> */}
      {/* <p className="max-w-full text-sm text-muted-foreground">
        {JSON.stringify(tool)}
      </p> */}
      <p className="max-w-full text-sm text-muted-foreground">
        {JSON.stringify(message.annotations)}
      </p>
    </div>
  )
}

export default DeepSearchSection
