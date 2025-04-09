'use client'

import { SimpleChat } from '@/components/chat/simple-chat'
import { useToolChat } from '@/hooks/use-tool-chat'
import { useAuth } from '@/lib/providers/auth-provider'
import { useChats } from '@/lib/providers/chats-provider'
import { useIssue } from '@/lib/providers/issue-provider'
import { generateUUID } from '@/lib/utils/helpers'
import { ChatRequestOptions, Message } from 'ai'
import { toast } from 'sonner'

interface IssueChatProps {
  id?: string
  initialMessages?: Message[]
}

export function IssueChat({ id, initialMessages }: IssueChatProps) {
  const { createNewChat, chats } = useChats()
  const { user } = useAuth()
  const { getCurrentContext, issue } = useIssue()

  const chat = id ? chats.find(c => c.id === id) : null
  const chatMessages = chat
    ? chat.messages
    : initialMessages || [
        {
          id: generateUUID(),
          role: 'assistant',
          content: "Hi, I'm Cooper. How can I help with this issue?"
        }
      ]

  const {
    data,
    messages,
    setMessages,
    input,
    append: originalAppend,
    status,
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
        context,
        data
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
        context,
        data
      }
    })
  }

  return (
    <SimpleChat
      id={id}
      data={{
        issue: issue
          ? {
              id: issue.id,
              title: issue.title,
              description: issue.description,
              status: issue.status,
              priority: issue.priority,
              category: issue.category,
              proposedSolution: issue.proposedSolution
            }
          : null
      }}
      messages={messages as Message[]}
      setMessages={setMessages as any}
      append={appendWithContext}
      addToolResult={addToolResult}
      isLoading={status === 'streaming' || status === 'submitted'}
      input={input}
      setInput={setInput}
      reload={reload}
      stop={stop}
      handleSubmit={handleSubmit}
    />
  )
}
