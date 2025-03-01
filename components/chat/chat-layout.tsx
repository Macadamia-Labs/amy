'use client'

import { Chat } from '@/components/chat/chat'
import { ChatRequestOptions } from 'ai'
import { CreateMessage, Message } from 'ai/react'
import { Dispatch, SetStateAction } from 'react'

interface ChatLayoutProps {
  id: string
  messages: Message[]
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  isLoading: boolean
  input: string
  setInput: Dispatch<SetStateAction<string>>
  reload?: any
  stop?: any
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
}

export function ChatLayout({
  id,
  messages,
  setMessages,
  append,
  isLoading,
  input,
  setInput,
  reload,
  stop,
  addToolResult,
  handleSubmit
}: ChatLayoutProps) {
  return (
    <Chat
      id={id}
      header="Cooper"
      messages={messages}
      setMessages={setMessages}
      append={append}
      isLoading={isLoading}
      input={input}
      setInput={setInput}
      reload={reload}
      stop={stop}
      addToolResult={addToolResult}
      handleSubmit={handleSubmit}
    />
  )
}
