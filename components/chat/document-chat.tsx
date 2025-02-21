'use client'

import { Chat } from '@/components/chat/chat'
import { useToolChat } from '@/hooks/use-tool-chat'
import { useAuth } from '@/lib/providers/auth-provider'
import { useChats } from '@/lib/providers/chats-provider'
import { useDocument } from '@/lib/providers/document-provider'
import { generateUUID } from '@/lib/utils/helpers'
import { ChatRequestOptions, Message } from 'ai'
import { toast } from 'sonner'

interface DocumentChatProps {
  id?: string
  initialMessages?: Message[]
}

export function DocumentChat({ id, initialMessages }: DocumentChatProps) {
  const { createNewChat, chats } = useChats()
  const { user } = useAuth()
  const { getCurrentContext } = useDocument()

  const chat = id ? chats.find(c => c.id === id) : null
  const chatMessages = chat
    ? chat.messages
    : initialMessages || [
        {
          id: generateUUID(),
          role: 'assistant',
          content: "Hi, I'm Oswald. How can I help?"
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
    initialMessages: chatMessages
  })

  const isNewChat = !id || messages?.length === 1

  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions
  ) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }
    const context = getCurrentContext()
    return originalHandleSubmit(event, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body,
        context
      }
    })
  }

  const appendWithContext = async (
    message: Message,
    chatRequestOptions?: ChatRequestOptions
  ) => {
    const context = getCurrentContext()
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
        ...chatRequestOptions?.body,
        context
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
