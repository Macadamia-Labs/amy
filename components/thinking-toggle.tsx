'use client'

import { Toggle } from '@/components/ui/toggle'
import { useState } from 'react'

interface ThinkingToggleProps {
  onModelChange: (model: string) => void
}

export function ThinkingToggle({ onModelChange }: ThinkingToggleProps) {
  const [isOn, setIsOn] = useState(false)

  const handleToggle = () => {
    setIsOn(!isOn)
    onModelChange(isOn ? 'openai:gpt-4o' : 'openai:o3-mini')
  }

  return (
    <div className="flex items-center gap-2">
      <Toggle
        pressed={isOn}
        onPressedChange={handleToggle}
        variant="outline"
        className="border rounded-2xl"
      >
        Think
      </Toggle>
    </div>
  )
}
