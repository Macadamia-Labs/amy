'use client'

import { ChatList } from '@/components/chat/chat-list'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { cn } from '@/lib/utils'
import { ChatRequestOptions, Message } from 'ai'
import { Dispatch, SetStateAction, useState } from 'react'
import { MultimodalInput } from './input/multimodal-input'
import { MessagesDialog } from './messages-dialog'

interface UploadQueueItem {
  name: string
  contentType: string
}

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string
  header?: string
  initialQuery?: string
  data?: any
  messages: Message[]
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  append: (
    message: Message,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
  reload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>
  stop: () => void
  isLoading: boolean
  input: string
  setInput: Dispatch<SetStateAction<string>>
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
  mainScript?: string
}

export function Chat({
  id,
  header,
  className,
  data,
  messages,
  setMessages,
  append,
  addToolResult,
  isLoading,
  input,
  setInput,
  stop,
  handleSubmit,
  mainScript
}: ChatProps) {
  const convertedMessages = messages.map(msg => ({
    ...msg,
    id: msg.id || Date.now().toString()
  })) as Message[]

  const [attachments, setAttachments] = useState<any[]>([])
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])
  const [showMessagesDialog, setShowMessagesDialog] = useState(false)

  return (
    <div className="flex flex-col h-full max-h-screen p-2">
      <h2 className="font-bold text-lg p-2">{header || 'Copilot'}</h2>

      <MessagesDialog
        open={showMessagesDialog}
        onOpenChange={setShowMessagesDialog}
        messages={messages}
      />

      <div className={cn('flex-grow overflow-y-auto', className)}>
        {messages.length ? (
          <>
            <ChatList
              messages={messages}
              append={append}
              setMessages={setMessages}
              isLoading={isLoading}
              chatId={id || ''}
              addToolResult={addToolResult}
            />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : null}
      </div>
      {/* {messages.length <= 1 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions setInput={setInput} chatId={id || ''} />
        )} */}

      <MultimodalInput
        chatId={id || ''}
        isLoading={isLoading}
        stop={stop}
        input={input}
        setInput={setInput}
        attachments={attachments}
        setAttachments={setAttachments}
        uploadQueue={uploadQueue}
        setUploadQueue={setUploadQueue}
        messages={convertedMessages}
        setMessages={setMessages}
        append={append}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}
