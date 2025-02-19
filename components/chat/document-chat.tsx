'use client'

import { Chat } from '@/components/chat/chat'
import { useToolChat } from '@/hooks/use-tool-chat'
import { useAuth } from '@/lib/providers/auth-provider'
import { useChats } from '@/lib/providers/chats-provider'
import { generateUUID } from '@/lib/utils/helpers'
import { Message } from 'ai'
import { toast } from 'sonner'

interface DocumentChatProps {
  id?: string
  initialMessages?: Message[]
}

export function DocumentChat({ id, initialMessages }: DocumentChatProps) {
  const { createNewChat, chats } = useChats()
  const { user } = useAuth()

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
    append,
    isLoading,
    setInput,
    reload,
    stop,
    handleSubmit,
    addToolResult
  } = useToolChat({
    id,
    initialMessages: chatMessages
  })

  const isNewChat = !id || messages?.length === 1

  return (
    <Chat
      id={id}
      data={data}
      messages={messages}
      setMessages={setMessages}
      append={async (value: Message) => {
        console.log('appending', value)
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
          return append(value as Message)
        } else {
          return append(value as Message)
        }
      }}
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
