'use client'

import { ToolInvocation } from 'ai'
import { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import { Separator } from './ui/separator'
import { TextShimmer } from './ui/text-shimmer'

interface ImageAnalysisResponse {
  description: string
  analysis: string
}

interface ImageAnalysisSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageAnalysisSection({
  tool,
  isOpen,
  onOpenChange
}: ImageAnalysisSectionProps) {
  // Sync external state to internal state
  useEffect(() => {
    setInternalOpen(isOpen)
  }, [isOpen])

  // Internal state to control collapsible
  const [internalOpen, setInternalOpen] = useState(isOpen)

  // Handle internal state changes and propagate to parent
  const handleOpenChange = (newIsOpen: boolean) => {
    setInternalOpen(newIsOpen)
    if (newIsOpen !== isOpen) {
      onOpenChange(newIsOpen)
    }
  }

  // Access args safely with type checking
  const parameters = tool.args as
    | { imageUrl: string; question: string }
    | undefined

  // The output is in the tool's result property, but only if the state is 'result'
  const output =
    tool.state === 'result'
      ? (tool.result as ImageAnalysisResponse | undefined)
      : undefined

  const imageUrl = parameters?.imageUrl || 'No image URL provided'
  const question = parameters?.question || 'No question provided'
  const description = output?.description || 'No description available'
  const analysis = output?.analysis || 'No analysis available'
  const isAnalyzing = tool.state !== 'result'

  return (
    <Collapsible open={internalOpen} onOpenChange={handleOpenChange}>
      <CollapsibleTrigger asChild className="w-full cursor-pointer">
        <div className="flex items-center justify-between p-3 bg-muted border rounded-2xl">
          <div className="flex items-center space-x-4">
            {imageUrl !== 'No image URL provided' ? (
              <img
                src={imageUrl}
                alt="Image preview"
                className="h-16 w-16 object-cover rounded-md border"
              />
            ) : (
              <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
            )}
            <div>
              {isAnalyzing ? (
                <TextShimmer className="text-sm font-medium">
                  Analyzing image...
                </TextShimmer>
              ) : (
                <p className="text-sm font-medium">Image Analyzed</p>
              )}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {question}
              </p>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4">
          <Separator className="my-2" />
          <h4 className="text-xs font-medium text-muted-foreground">
            Analysis
          </h4>
          <p className="text-xs whitespace-pre-wrap font-mono">{analysis}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
