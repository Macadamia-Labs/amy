'use client'

import { useResources } from '@/components/providers/resources-provider'
import { useToolChat } from '@/hooks/use-tool-chat'
import { useChatId } from '@/lib/hooks/use-chat-id'
import { Workflow } from '@/lib/types/workflow'
import { cn, generateUUID } from '@/lib/utils/helpers'
import { JSONValue, Message } from 'ai'
import React, { useEffect, useState } from 'react'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'
import { ScrollArea } from './ui/scroll-area'

export function Chat({
  id,
  savedMessages = [],
  query,
  projectId,
  newConversation,
  isWorkflow = false,
  workflowContext
}: {
  id: string
  savedMessages?: Message[]
  query?: string
  projectId?: string
  newConversation?: boolean
  isWorkflow?: boolean
  workflowContext?: Workflow
}) {
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    () => {
      if (workflowContext?.resourceIds) {
        return new Set(workflowContext.resourceIds)
      }
      return new Set<string>()
    }
  )
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    workflowContext ? workflowContext.id : null
  )
  const { resources } = useResources()
  const { chatId } = useChatId()

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
    toolInvocations,
    error,
    reload
  } = useToolChat({
    id: id || chatId,
    initialMessages: savedMessages as any,
    resourcesContext: {
      resourceIds: Array.from(selectedResourceIds),
      resourcesContent: selectedResourcesContent
    },
    workflow: workflowContext,
    projectId,
    // selectedModel: 'google:gemini-2.0-flash-001'
    selectedModel: 'openai:gpt-4.1'
  })

  const [localData, setLocalData] = useState<JSONValue[] | undefined>()

  useEffect(() => {
    if (newConversation) {
      reload()
    }
  }, [id])

  useEffect(() => {
    // Automatically submit if there's an initial message
    if (savedMessages.length > 0 && messages.length === savedMessages.length) {
      handleSubmit()
    }
  }, [savedMessages, messages, handleSubmit])

  useEffect(() => {
    // Save messages to local storage whenever they change
    localStorage.setItem(`chat-messages-${id}`, JSON.stringify(messages))
  }, [messages, id])

  useEffect(() => {
    // Load messages from local storage when the component mounts
    const savedMessages = localStorage.getItem(`chat-messages-${id}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
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
    <div
      className={cn(
        'flex flex-col w-full max-w-3xl h-full mx-auto justify-center',
        isWorkflow && 'max-w-full mx-0'
      )}
    >
      {/* <p>New Conversation: { ? 'true' : 'false'}</p> */}
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
            messages={messages as Message[]}
            data={localData}
            onQuerySelect={onQuerySelect}
            status={status}
            chatId={id}
            onResetToMessage={handleResetToMessage}
            toolInvocations={toolInvocations}
            error={error}
          />
        </ScrollArea>
      )}
      <div className="sticky bottom-0 bg-background">
        <ChatPanel
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === 'streaming' || status === 'submitted'}
          messages={messages as Message[]}
          setMessages={setMessages as any}
          stop={stop}
          query={query}
          append={append}
          selectedResourceIds={selectedResourceIds}
          setSelectedResourceIds={setSelectedResourceIds}
          selectedWorkflowId={selectedWorkflowId}
          setSelectedWorkflowId={setSelectedWorkflowId}
          isWorkflow={isWorkflow}
        />
      </div>
    </div>
  )
}
