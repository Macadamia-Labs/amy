'use client'

import { useResources } from '@/components/providers/resources-provider'
import { useToolChat } from '@/hooks/use-tool-chat'
import { generateUUID } from '@/lib/utils/helpers'
import { JSONValue } from 'ai'
import { Message } from 'ai/react'
import React, { useEffect, useState } from 'react'
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
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set()
  )
  const { resources } = useResources()

  const selectedResourcesContent = React.useMemo(() => {
    const selectedResources = resources.filter(r =>
      selectedResourceIds.has(r.id)
    )
    return selectedResources
      .map(resource => resource.content_as_text)
      .filter(Boolean)
      .join('\n\n---\n\n')
  }, [resources, selectedResourceIds])

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
    toolInvocations
  } = useToolChat({
    id: CHAT_ID,
    initialMessages: savedMessages as any,
    resourcesContext: {
      resourceIds: Array.from(selectedResourceIds),
      resourcesContent: selectedResourcesContent
    }
  })

  const [localData, setLocalData] = useState<JSONValue[] | undefined>()

  useEffect(() => {
    setMessages(savedMessages as any)
  }, [id])

  const onQuerySelect = (query: string) => {
    append({
      id: generateUUID(),
      role: 'user',
      content: query
    })
  }

  const handleResetToMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    if (messageIndex !== -1) {
      setMessages(messages.slice(0, messageIndex + 1))
      setLocalData(undefined)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-full mx-auto justify-center">
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <ChatMessages
            messages={messages}
            data={localData}
            onQuerySelect={onQuerySelect}
            isLoading={isLoading}
            chatId={id}
            onResetToMessage={handleResetToMessage}
            toolInvocations={toolInvocations}
          />
        </div>
      )}
      <div className="sticky bottom-0 bg-background">
        <ChatPanel
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
          stop={stop}
          query={query}
          append={append}
          selectedResourceIds={selectedResourceIds}
          setSelectedResourceIds={setSelectedResourceIds}
        />
      </div>
    </div>
  )
}
