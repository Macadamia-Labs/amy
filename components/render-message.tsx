import { JSONValue, Message, ToolInvocation } from 'ai'
import { useMemo } from 'react'
import { AnswerSection } from './answer-section'
import { BotMessage } from './message'
import { ReasoningAnswerSection } from './reasoning-answer-section'
import RelatedQuestions from './related-questions'
import { ToolSection } from './tool-section'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from './ui/context-menu'
import { UserMessage } from './user-message'

interface RenderMessageProps {
  message: Message
  messageId: string
  getIsOpen: (id: string) => boolean
  onOpenChange: (id: string, open: boolean) => void
  onQuerySelect: (query: string) => void
  onResetToMessage?: (messageId: string) => void
  chatId?: string
}

export function RenderMessage({
  message,
  messageId,
  getIsOpen,
  onOpenChange,
  onQuerySelect,
  onResetToMessage,
  chatId
}: RenderMessageProps) {
  const relatedQuestions = useMemo(
    () =>
      message.annotations?.filter(
        annotation => (annotation as any)?.type === 'related-questions'
      ),
    [message.annotations]
  )

  // Extract tool invocations from message parts
  const toolInvocations = useMemo(() => {
    return (
      message.parts
        ?.filter(part => part.type === 'tool-invocation')
        .map(part =>
          part.type === 'tool-invocation' ? part.toolInvocation : null
        )
        .filter((tool): tool is ToolInvocation => tool !== null) || []
    )
  }, [message.parts])

  // Render for manual tool call
  const toolData = useMemo(() => {
    const toolAnnotations =
      (message.annotations?.filter(
        annotation =>
          (annotation as unknown as { type: string }).type === 'tool_call'
      ) as unknown as Array<{
        data: {
          args: string
          toolCallId: string
          toolName: string
          result?: string
          state: 'call' | 'result'
        }
      }>) || []

    const toolDataMap = toolAnnotations.reduce((acc, annotation) => {
      const existing = acc.get(annotation.data.toolCallId)
      if (!existing || annotation.data.state === 'result') {
        acc.set(annotation.data.toolCallId, {
          ...annotation.data,
          args: annotation.data.args ? JSON.parse(annotation.data.args) : {},
          result:
            annotation.data.result && annotation.data.result !== 'undefined'
              ? JSON.parse(annotation.data.result)
              : undefined
        } as ToolInvocation)
      }
      return acc
    }, new Map<string, ToolInvocation>())

    return Array.from(toolDataMap.values())
  }, [message.annotations])

  // Extract the unified reasoning annotation directly.
  const reasoningAnnotation = useMemo(() => {
    const annotations = message.annotations as any[] | undefined
    if (!annotations) return null
    return (
      annotations.find(a => a.type === 'reasoning' && a.data !== undefined) ||
      null
    )
  }, [message.annotations])

  // Extract the reasoning time and reasoning content from the annotation.
  // If annotation.data is an object, use its fields. Otherwise, default to a time of 0.
  const reasoningTime = useMemo(() => {
    if (!reasoningAnnotation) return 0
    if (
      typeof reasoningAnnotation.data === 'object' &&
      reasoningAnnotation.data !== null
    ) {
      return reasoningAnnotation.data.time ?? 0
    }
    return 0
  }, [reasoningAnnotation])

  const reasoningResult = useMemo(() => {
    // First try to get reasoning from parts
    const reasoningPart = message.parts?.find(part => part.type === 'reasoning')
    if (reasoningPart?.type === 'reasoning') {
      return reasoningPart.reasoning
    }

    // Fallback to annotation if exists
    if (!reasoningAnnotation) return undefined
    if (
      typeof reasoningAnnotation.data === 'object' &&
      reasoningAnnotation.data !== null
    ) {
      return reasoningAnnotation.data.reasoning
    }

    return undefined
  }, [reasoningAnnotation, message.parts])

  if (message.role === 'user') {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <UserMessage message={message.content} />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onResetToMessage?.(messageId)}>
            Reset conversation to this message
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  if (toolInvocations.length > 0) {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <>
            {toolInvocations.map(tool => (
              <ToolSection
                key={tool.toolCallId}
                message={message}
                tool={tool}
                isOpen={getIsOpen(messageId)}
                onOpenChange={open => onOpenChange(messageId, open)}
              />
            ))}
            <BotMessage message={message.content} />
          </>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onResetToMessage?.(messageId)}>
            Reset conversation to this message
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <>
          {toolData.map(tool => (
            <ToolSection
              key={tool.toolCallId}
              tool={tool}
              message={message}
              isOpen={getIsOpen(tool.toolCallId)}
              onOpenChange={open => onOpenChange(tool.toolCallId, open)}
            />
          ))}
          {reasoningResult ? (
            <ReasoningAnswerSection
              content={{
                reasoning: reasoningResult,
                answer: message.content,
                time: reasoningTime
              }}
              isOpen={getIsOpen(messageId)}
              onOpenChange={open => onOpenChange(messageId, open)}
            />
          ) : (
            <AnswerSection
              content={message.content}
              isOpen={getIsOpen(messageId)}
              onOpenChange={open => onOpenChange(messageId, open)}
              chatId={chatId}
            />
          )}
          {!toolInvocations.length &&
            relatedQuestions &&
            relatedQuestions.length > 0 && (
              <RelatedQuestions
                annotations={relatedQuestions as JSONValue[]}
                onQuerySelect={onQuerySelect}
                isOpen={getIsOpen(`${messageId}-related`)}
                onOpenChange={open =>
                  onOpenChange(`${messageId}-related`, open)
                }
              />
            )}
        </>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onResetToMessage?.(messageId)}>
          Reset conversation to this message
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
