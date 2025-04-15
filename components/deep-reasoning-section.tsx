'use client'

import { CheckCircleIcon } from '@/lib/utils/icons'
import { Message, ToolInvocation } from 'ai'
import { useEffect, useState } from 'react'
import Loader from './lottie/loader'
import { Collapsible, CollapsibleContent } from './ui/collapsible'
import { TextShimmer } from './ui/text-shimmer'

interface DeepReasoningSectionProps {
  message: Message
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DeepReasoningSection({
  message,
  tool,
  isOpen,
  onOpenChange
}: DeepReasoningSectionProps) {
  const isLoading = tool.state === 'call'
  const query = tool.args.query as string
  const reasoningEffort = tool.args.reasoningEffort || 'low'

  const [progressMessage, setProgressMessage] = useState<string>('Idle')
  const [reasoning, setReasoning] = useState<string>('')
  const [finalAnswer, setFinalAnswer] = useState<string>('')

  useEffect(() => {
    const annotations = message.annotations || []
    let currentProgress = 'Processing...'
    let foundAnswer = ''
    let foundReasoning = ''
    let isInProgress = false
    let eventFired = false

    annotations.forEach((annotation: any) => {
      if (
        annotation.type === 'tool-status' &&
        annotation.toolCallId === 'deep-reasoning' &&
        annotation.status === 'in-progress'
      ) {
        isInProgress = true
      }

      if (
        annotation.type === 'tool-event' &&
        annotation.toolCallId === 'deep-reasoning'
      ) {
        eventFired = true
        if (
          annotation.event === 'answer-generated' &&
          annotation.data &&
          typeof annotation.data === 'object'
        ) {
          if (
            'answer' in annotation.data &&
            typeof annotation.data.answer === 'string'
          ) {
            foundAnswer = annotation.data.answer
          }
          if (
            'reasoning' in annotation.data &&
            typeof annotation.data.reasoning === 'string'
          ) {
            foundReasoning = annotation.data.reasoning
          }
          currentProgress = 'Answer generated.'
        }
      }
    })

    setFinalAnswer(foundAnswer)
    setReasoning(foundReasoning)

    if (foundAnswer || foundReasoning) {
      setProgressMessage('Answer generated.')
    } else if (isInProgress && !eventFired) {
      setProgressMessage('Deep reasoning in progress...')
    } else if (eventFired) {
      setProgressMessage(currentProgress)
    } else if (!isLoading && tool.state === 'result') {
      setProgressMessage('Deep reasoning complete.')
    } else if (!isLoading) {
      setProgressMessage('Idle')
    }
  }, [message.annotations, tool.state, isLoading])

  const displayProgress = isLoading
    ? progressMessage !== 'Idle'
      ? progressMessage
      : 'Deep reasoning starting...'
    : finalAnswer || reasoning
    ? 'Answer generated.'
    : progressMessage !== 'Idle'
    ? progressMessage
    : 'Deep reasoning complete.'

  return (
    <div className="flex flex-col gap-1 w-full border bg-muted rounded-lg p-2">
      <div className="flex items-center gap-2 w-full">
        {isLoading ? (
          <Loader className="size-5" />
        ) : (
          <CheckCircleIcon className="size-5 text-green-500" />
        )}
        <p className="font-bold">Deep Reasoning</p>
        {isLoading ? (
          <TextShimmer className="text-sm">{displayProgress}</TextShimmer>
        ) : (
          <p className="text-sm text-muted-foreground">{displayProgress}</p>
        )}
      </div>
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold">Query:</span> <br />
              {query}
            </p>
            {reasoning && (
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">Reasoning:</span> <br />
                {reasoning}
              </p>
            )}
            {finalAnswer && (
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">Final Answer:</span> <br />
                {finalAnswer}
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default DeepReasoningSection
