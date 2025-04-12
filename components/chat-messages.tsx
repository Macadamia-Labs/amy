import { ToolInvocation } from '@/hooks/use-tool-chat'
import { JSONValue, Message } from 'ai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { RenderMessage } from './render-message'
import { ToolSection } from './tool-section'
import { Skeleton } from './ui/skeleton'

interface ChatMessagesProps {
  messages: Message[]
  data: JSONValue[] | undefined
  onQuerySelect: (query: string) => void
  status: 'error' | 'submitted' | 'streaming' | 'ready'
  chatId?: string
  onResetToMessage?: (messageId: string) => void
  toolInvocations?: ToolInvocation[]
  error?: Error
}

export function ChatMessages({
  messages,
  data,
  onQuerySelect,
  chatId,
  onResetToMessage,
  status,
  error
}: ChatMessagesProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  const manualToolCallId = 'manual-tool-call'

  // Add ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  // Scroll to bottom on mount and when messages change
  useEffect(() => {
    scrollToBottom()
  }, [])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user') {
      setOpenStates({ [manualToolCallId]: true })
    }
  }, [messages])

  // get last tool data for manual tool call
  const lastToolData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null

    const lastItem = data[data.length - 1] as {
      type: 'tool_call'
      data: {
        toolCallId: string
        state: 'call' | 'result'
        toolName: string
        args: string
      }
    }

    if (lastItem.type !== 'tool_call') return null

    const toolData = lastItem.data
    return {
      state: 'call' as const,
      toolCallId: toolData.toolCallId,
      toolName: toolData.toolName,
      args: toolData.args ? JSON.parse(toolData.args) : undefined
    }
  }, [data])

  if (!messages.length) return null

  const lastUserIndex =
    messages.length -
    1 -
    [...messages].reverse().findIndex(msg => msg.role === 'user')

  // const showLoading = isLoading && messages[messages.length - 1].role === 'user'

  const getIsOpen = (id: string) => {
    const baseId = id.endsWith('-related') ? id.slice(0, -8) : id
    const index = messages.findIndex(msg => msg.id === baseId)
    return openStates[id] ?? index >= lastUserIndex
  }

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenStates(prev => ({
      ...prev,
      [id]: open
    }))
  }

  return (
    <div className="relative mx-auto px-4 w-full py-4">
      {messages.map(message => (
        <div key={message.id} className="mb-4 flex flex-col gap-4">
          <RenderMessage
            message={message}
            messageId={message.id}
            getIsOpen={getIsOpen}
            onOpenChange={handleOpenChange}
            onQuerySelect={onQuerySelect}
            onResetToMessage={onResetToMessage}
            chatId={chatId}
          />
        </div>
      ))}
      {lastToolData && (
        <ToolSection
          key={manualToolCallId}
          message={messages[messages.length - 1]}
          tool={lastToolData}
          message={messages[messages.length - 1]}
          isOpen={getIsOpen(manualToolCallId)}
          onOpenChange={open => handleOpenChange(manualToolCallId, open)}
        />
      )}
      {status === 'submitted' && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
      )}
      {status === 'error' && (
        <p className="text-sm w-full bg-red-50 text-red-500 p-4 rounded-xl dark:bg-red-900/30">
          Something went wrong. Please try again. <br />
          {error?.message}
        </p>
      )}
      <div ref={messagesEndRef} className="h-4" />{' '}
      {/* Add some padding at the bottom */}
    </div>
  )
}
