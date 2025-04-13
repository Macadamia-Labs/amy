'use client'

import { ToolInvocation } from 'ai'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? 'image-analysis' : ''}
      onValueChange={value => onOpenChange(value === 'image-analysis')}
    >
      <AccordionItem value="image-analysis">
        <AccordionTrigger className="text-sm font-medium">
          Image Analysis: {question}
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Image Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">
                    Image URL
                  </h4>
                  <p className="text-sm break-all">{imageUrl}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">
                    Question
                  </h4>
                  <p className="text-sm">{question}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm">{description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">
                    Analysis
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">{analysis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
