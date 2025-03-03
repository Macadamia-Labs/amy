'use client'

import { Button } from '@/components/ui/button'
import { ExtendedToolCallPart } from '@/lib/types/tool-types'
import { Check, X } from 'lucide-react'

interface AskForConfirmationToolProps {
  tool: ExtendedToolCallPart
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
}

export function AskForConfirmationTool({
  tool,
  addToolResult
}: AskForConfirmationToolProps) {
  const handleConfirm = () => {
    addToolResult({
      toolCallId: tool.toolCallId,
      result: { message: 'User confirmed' }
    })
  }

  const handleDeny = () => {
    addToolResult({
      toolCallId: tool.toolCallId,
      result: { message: 'User denied' }
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button onClick={handleConfirm} className="flex-1" variant="outline">
          <Check className="mr-2 h-4 w-4" />
          <span className="font-medium">{tool.args.description}</span>
        </Button>
        <Button onClick={handleDeny} variant="outline" size="icon" className="">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
