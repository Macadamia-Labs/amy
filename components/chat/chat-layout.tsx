'use client'

import { Chat } from '@/components/chat/chat'
import { Button } from '@/components/ui/button'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useCooper } from '@/lib/providers/cooper-provider'
import { cn } from '@/lib/utils'
import { ChatRequestOptions } from 'ai'
import { CreateMessage, Message } from 'ai/react'
import { MaximizeIcon, MinimizeIcon } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface ChatLayoutProps {
  id: string
  messages: Message[]
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  isLoading: boolean
  input: string
  setInput: Dispatch<SetStateAction<string>>
  reload?: any
  stop?: any
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
}

export function ChatLayout({
  id,
  messages,
  setMessages,
  append,
  isLoading,
  input,
  setInput,
  reload,
  stop,
  addToolResult,
  handleSubmit
}: ChatLayoutProps) {
  const { showTabs, setShowTabs, hasContent } = useCooper()

  return (
    <ResizablePanelGroup direction="horizontal" className="p-2 pt-0 gap-2">
      <ResizablePanel
        className="border rounded-lg min-h-0 bg-sidebar relative"
        defaultSize={50}
      >
        {/* {hasContent && ( */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10"
          onClick={() => setShowTabs(!showTabs)}
        >
          {showTabs ? (
            <MaximizeIcon className="h-4 w-4" />
          ) : (
            <MinimizeIcon className="h-4 w-4" />
          )}
        </Button>
        {/* )} */}

        <Chat
          id={id}
          header="Cooper"
          messages={messages}
          setMessages={setMessages}
          append={append}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          reload={reload}
          stop={stop}
          addToolResult={addToolResult}
          handleSubmit={handleSubmit}
        />
      </ResizablePanel>
      {/* {showTabs && hasContent && ( */}
      {showTabs && (
        <ResizablePanel
          className={cn(
            'border h-full rounded-lg bg-sidebar transition-all duration-300 p-4'
          )}
          defaultSize={50}
        >
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  )
}
