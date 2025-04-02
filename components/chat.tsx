'use client'

import { Message, useChat } from 'ai/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { CHAT_ID } from '../lib/constants'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'

export function Chat({
  id,
  savedMessages = [],
  query
}: {
  id: string
  savedMessages?: Message[]
  query?: string
}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    stop,
    append,
    data,
    setData
  } = useChat({
    initialMessages: savedMessages,
    id: CHAT_ID,
    body: {
      id
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/search/${id}`)
    },
    onError: error => {
      toast.error(`Error in chat: ${error.message}`)
    },
    sendExtraMessageFields: false // Disable extra message fields
  })

  useEffect(() => {
    setMessages(savedMessages)
  }, [id])

  const onQuerySelect = (query: string) => {
    append({
      role: 'user',
      content: query
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setData(undefined) // reset data to clear tool call
    handleSubmit(e)
  }

  const handleResetToMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    if (messageIndex !== -1) {
      setMessages(messages.slice(0, messageIndex + 1))
      setData(undefined) // reset data to clear tool call
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-full mx-auto justify-center">
      {
        messages.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <ChatMessages
              messages={messages}
              data={data}
              onQuerySelect={onQuerySelect}
              isLoading={isLoading}
              chatId={id}
              onResetToMessage={handleResetToMessage}
            />
          </div>
        )
      }
      <div className="sticky bottom-0 bg-background">
        <ChatPanel
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
          stop={stop}
          query={query}
          append={append}
        />
      </div>
    </div>
  )
}
