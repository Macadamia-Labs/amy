'use client'

import { CheckCircleIcon } from '@/lib/utils/icons'
import { Message, ToolInvocation } from 'ai'
import { useEffect, useState } from 'react'
import Loader from './lottie/loader'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import { TextShimmer } from './ui/text-shimmer'

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

  const [progressMessage, setProgressMessage] = useState<string>('Idle')
  const [subquestions, setSubquestions] = useState<string[]>([])
  const [finalAnswer, setFinalAnswer] = useState<string>('')

  useEffect(() => {
    const annotations = message.annotations || []
    annotations.forEach((annotation: any) => {
      if (
        annotation.type === 'tool-status' &&
        annotation.toolCallId === 'deep-search'
      ) {
        if (annotation.status === 'in-progress') {
          setProgressMessage('Deep search in progress...')
        }
      }
      if (
        annotation.type === 'tool-event' &&
        annotation.toolCallId === 'deep-search'
      ) {
        switch (annotation.event) {
          case 'resources-context-generated':
            setProgressMessage('Resources context generated.')
            break
          case 'subquestions-generated':
            setSubquestions(annotation.data.subquestions)
            setProgressMessage('Subquestions generated.')
            break
          case 'subquestions-answers-generated':
            setProgressMessage('Subquestions answers generated.')
            break
          case 'answer-generated':
            setFinalAnswer(annotation.data.answer)
            setProgressMessage('Final answer generated.')
            break
          default:
            setProgressMessage('Processing...')
        }
      }
    })
  }, [message.annotations])

  return (
    <div className="flex flex-col gap-1 w-full border bg-muted rounded-lg p-2">
      <div className="flex items-center gap-2 w-full">
        {isLoading ? (
          <Loader className="size-5" />
        ) : (
          <CheckCircleIcon className="size-5 text-green-500" />
        )}
        <p className="font-bold">Deep Search</p>
        {isLoading ? (
          <TextShimmer className="text-sm ml-auto">
            {`Searching through ${resourceIds.length} resources`}
          </TextShimmer>
        ) : (
          <p className="text-sm text-muted-foreground ml-auto">
            used {resourceIds.length} resources
          </p>
        )}
      </div>
      <Collapsible>
        <CollapsibleTrigger className="text-sm text-muted-foreground cursor-pointer">
          {isLoading ? (
            <TextShimmer className="text-sm">{progressMessage}</TextShimmer>
          ) : (
            <p className="text-sm text-muted-foreground">{progressMessage}</p>
          )}{' '}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold">Resource IDs:</span> <br />
              {resourceIds.map(id => (
                <p key={id}>{id}</p>
              ))}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold">Subquestions:</span> <br />
              {subquestions.map(question => (
                <p key={question}>{question}</p>
              ))}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold">Final Answer:</span> <br />
              {finalAnswer}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default DeepSearchSection
