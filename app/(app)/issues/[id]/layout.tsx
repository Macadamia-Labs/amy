'use client'

import { IssueChat } from '@/components/chat/issue-chat'
import IssueHeader from '@/components/layout/issue-header'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { sampleIssues } from '@/data/issues'
import {
    ChatVisibilityProvider,
    useChatVisibility
} from '@/lib/providers/chat-visibility-provider'
import { ChatsProvider } from '@/lib/providers/chats-provider'
import { IssueProvider } from '@/lib/providers/issue-provider'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useParams } from 'next/navigation'
import { useRef } from 'react'

function IssueLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const chatId = useRef(nanoid()).current
  const issue = sampleIssues.find(i => i.id === params.id)

  if (!issue) {
    return <div>Issue not found</div>
  }

  return (
    <ChatVisibilityProvider>
      <ChatsProvider>
        <IssueProvider issue={issue}>
          <IssueLayoutContent chatId={chatId} issue={issue}>
            {children}
          </IssueLayoutContent>
        </IssueProvider>
      </ChatsProvider>
    </ChatVisibilityProvider>
  )
}

function IssueLayoutContent({
  children,
  chatId,
  issue
}: {
  children: React.ReactNode
  chatId: string
  issue: any
}) {
  const { isChatVisible, hideChat } = useChatVisibility()

  return (
    <div className="flex flex-col h-full">
      {isChatVisible ? (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={65} minSize={30} order={1}>
            <div className="flex flex-col h-full">
              <IssueHeader issue={issue} />
              <ScrollArea className="flex-1">{children}</ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35} order={2}>
            <div className="relative h-full">
              <IssueChat id={chatId} />
              <Button
                variant="ghost"
                size="icon"
                onClick={hideChat}
                aria-label="Close chat panel"
                className="size-8 absolute top-4 right-4"
              >
                <X className="size-4" />
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-col h-full">
          <IssueHeader issue={issue} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      )}
    </div>
  )
}

export default IssueLayout
