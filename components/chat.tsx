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
import { ScrollArea } from './ui/scroll-area'

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
  const [selectedModel, setSelectedModel] = useState('openai:gpt-4o')
  const [debugOpen, setDebugOpen] = useState(false)

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
    status,
    setMessages,
    stop,
    append,
    toolInvocations
  } = useToolChat({
    id: CHAT_ID,
    initialMessages: savedMessages as any,
    resourcesContext: {
      resourceIds: Array.from(selectedResourceIds),
      resourcesContent: selectedResourcesContent
    },
    selectedModel
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
      {/* <div className="flex justify-end p-2">
        <Dialog open={debugOpen} onOpenChange={setDebugOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Debug Messages
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Messages Debug View</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-full max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-md">
                {JSON.stringify(messages, null, 2)}
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div> */}
      {messages.length > 0 && (
        <ScrollArea className="flex-1">
          <ChatMessages
            messages={messages}
            data={localData}
            onQuerySelect={onQuerySelect}
            status={status}
            chatId={id}
            onResetToMessage={handleResetToMessage}
            toolInvocations={toolInvocations}
          />
        </ScrollArea>
      )}
      <div className="sticky bottom-0 bg-background">
        <ChatPanel
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === 'streaming' || status === 'submitted'}
          messages={messages}
          setMessages={setMessages}
          stop={stop}
          query={query}
          append={append}
          selectedResourceIds={selectedResourceIds}
          setSelectedResourceIds={setSelectedResourceIds}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  )
}
