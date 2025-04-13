'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface InstructionsCardProps {
  onInstructionsChange: (instructions: string) => void
}

export function InstructionsCard({
  onInstructionsChange
}: InstructionsCardProps) {
  const [instructions, setInstructions] = useState('')

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newInstructions = e.target.value
    setInstructions(newInstructions)
    onInstructionsChange(newInstructions)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
        <CardDescription>Configure and run this workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter your instructions here..."
          value={instructions}
          onChange={handleInstructionsChange}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  )
}
