'use client'

import { useWorkflows } from '@/components/providers/workflows-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { updateWorkflow } from '@/lib/actions/workflows'
import { CheckIcon, PencilIcon, TextFileIcon } from '@/lib/utils/icons'
import { useState } from 'react'
import { toast } from 'sonner'

interface InstructionsCardProps {
  workflowId: string
  initialInstructions: string
}

export function InstructionsCard({
  workflowId,
  initialInstructions
}: InstructionsCardProps) {
  const { updateWorkflow: updateWorkflowInContext } = useWorkflows()
  const [instructions, setInstructions] = useState(initialInstructions)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newInstructions = e.target.value
    setInstructions(newInstructions)
  }

  const handleSave = async () => {
    try {
      await updateWorkflow(workflowId, { instructions })
      updateWorkflowInContext(workflowId, { instructions })
      setIsEditMode(false)
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update instructions'
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Card className="bg-muted rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between relative">
        <CardTitle className="flex flex-row items-center">
          <TextFileIcon className="size-6 mr-2" /> Instructions
        </CardTitle>
        <Toggle
          pressed={isEditMode}
          onPressedChange={pressed => {
            if (!pressed) {
              handleSave()
            } else {
              setIsEditMode(true)
            }
          }}
          className="bg-transparent top-2 right-4 absolute"
        >
          {isEditMode ? <CheckIcon /> : <PencilIcon />}
        </Toggle>
      </CardHeader>
      <CardContent>
        {isEditMode ? (
          <Textarea
            placeholder="Enter your instructions here..."
            value={instructions}
            onChange={handleInstructionsChange}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] outline-none"
            disabled={!isEditMode}
          />
        ) : (
          <div className="prose dark:prose-invert">
            <MemoizedReactMarkdown>{instructions}</MemoizedReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
