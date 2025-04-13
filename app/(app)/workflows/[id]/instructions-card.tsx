'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { CheckIcon, PencilIcon } from '@/lib/utils/icons'
import { useState } from 'react'

export function InstructionsCard() {
  const [instructions, setInstructions] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newInstructions = e.target.value
    setInstructions(newInstructions)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsEditMode(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between relative">
        {' '}
        <CardTitle>Instructions</CardTitle>
        <Toggle
          pressed={isEditMode}
          onPressedChange={setIsEditMode}
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
