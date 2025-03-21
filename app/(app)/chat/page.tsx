'use client'
import { Chat } from '@/components/chat/chat'

import { useToolChat } from '@/hooks/use-tool-chat'
import { useAuth } from '@/lib/providers/auth-provider'
import { useChats } from '@/lib/providers/chats-provider'
import { generateUUID } from '@/lib/utils/helpers'
import { ChatRequestOptions, CoreMessage, Message } from 'ai'
import { useMemo } from 'react'
import { toast } from 'sonner'
export default function ChatPage() {
  const { createNewChat, chats } = useChats()
  const { user } = useAuth()

  const id = useMemo(() => {
    return generateUUID()
  }, [])
  const chatMessages = [
    {
      id: generateUUID(),
      role: 'assistant',
      content: "Hi, I'm Cooper. How can I help?"
    }
  ]

  const {
    data,
    messages,
    setMessages,
    input,
    append: originalAppend,
    isLoading,
    setInput,
    reload,
    stop,
    handleSubmit: originalHandleSubmit,
    addToolResult
  } = useToolChat({
    id,
    initialMessages: chatMessages as CoreMessage[]
  })

  const isNewChat = !id || messages?.length === 1

  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions
  ) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }
    // const context = getCurrentContext()
    return originalHandleSubmit(event, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body
        // context
      }
    })
  }

  const appendWithContext = async (
    message: Message,
    chatRequestOptions?: ChatRequestOptions
  ) => {
    // const context = getCurrentContext()
    if (isNewChat) {
      if (!user?.id) {
        toast.error('User not found')
        return null
      }
      await createNewChat({
        id,
        title: 'New Chat',
        user_id: user?.id
      })
    }
    return originalAppend(message, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body
        // context
      }
    })
  }

  return (
    <Chat
      id={id}
      data={data}
      messages={messages}
      setMessages={setMessages}
      append={appendWithContext}
      addToolResult={addToolResult}
      isLoading={isLoading}
      input={input}
      setInput={setInput}
      reload={reload}
      stop={stop}
      handleSubmit={handleSubmit}
    />
  )
}
