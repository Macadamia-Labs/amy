'use client'

import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom'
import { ChatRequestOptions, Message } from 'ai'
import { memo } from 'react'
import { PreviewMessage, ThinkingMessage } from './message'

interface MessagesProps {
  chatId: string
  isLoading: boolean
  messages: Array<Message>
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  append: (
    message: Message,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  isReadonly: boolean
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
}

function PureMessages({
  chatId,
  isLoading,
  messages,
  append,
  setMessages,
  isReadonly,
  addToolResult
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-2 flex-1 overflow-auto pt-4 no-scrollbar"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading && messages.length - 1 === index}
          isReadonly={isReadonly}
          append={append}
          addToolResult={addToolResult}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false
  if (prevProps.isLoading && nextProps.isLoading) return false
  if (prevProps.messages !== nextProps.messages) return false

  return true
})
