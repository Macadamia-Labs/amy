'use client'

import { WorkflowSelector } from '@/components/templates/workflow-selector'
import { Button } from '@/components/ui/button'
import { useChatId } from '@/lib/hooks/use-chat-id'
import { cn } from '@/lib/utils'
import { Message } from 'ai'
import { ArrowUp, MessageCirclePlus, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { EmptyScreen } from './empty-screen'
import { ResourcesSelector } from './resources/resources-selector'

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: Message) => void
  selectedResourceIds: Set<string>
  setSelectedResourceIds: (ids: Set<string>) => void
  selectedWorkflowId: string | null
  setSelectedWorkflowId: (id: string | null) => void
  isWorkflow: boolean
}

export function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  selectedResourceIds,
  setSelectedResourceIds,
  selectedWorkflowId,
  setSelectedWorkflowId,
  isWorkflow
}: ChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)
  const { createNewChat } = useChatId()

  const handleCompositionStart = () => setIsComposing(true)

  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleNewChat = () => {
    const newChatId = createNewChat()
    setMessages([])
    router.push(`/?chat=${newChatId}`)
  }

  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({
        id: Math.random().toString(),
        role: 'user',
        content: query
      })
      isFirstRender.current = false
    }
  }, [query, append])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'max-w-3xl w-full mx-auto',
        messages.length > 0 ? 'px-2 py-4' : 'px-6',
        isWorkflow && 'max-w-full mx-0 p-0'
      )}
    >
      <div className="relative flex flex-col w-full gap-2 bg-card rounded-3xl border border-input">
        <Textarea
          ref={inputRef}
          name="input"
          rows={1}
          maxRows={5}
          tabIndex={0}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="Ask a question..."
          spellCheck={false}
          value={input}
          className="resize-none w-full bg-transparent border-0 p-5 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onChange={e => {
            handleInputChange(e)
            setShowEmptyScreen(e.target.value.length === 0)
          }}
          onKeyDown={e => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !isComposing &&
              !enterDisabled
            ) {
              if (input.trim().length === 0) {
                e.preventDefault()
                return
              }
              e.preventDefault()
              const textarea = e.target as HTMLTextAreaElement
              textarea.form?.requestSubmit()
            }
          }}
          onFocus={() => setShowEmptyScreen(true)}
          onBlur={() => setShowEmptyScreen(false)}
        />

        <div className="flex items-center justify-between p-3">
          {!isWorkflow && (
            <div className="flex items-center gap-2">
              <ResourcesSelector
                selectedIds={selectedResourceIds}
                onSelect={setSelectedResourceIds}
              />
              <WorkflowSelector
                selectedIds={
                  new Set(selectedWorkflowId ? [selectedWorkflowId] : [])
                }
                onSelect={ids =>
                  setSelectedWorkflowId(
                    ids.size > 0 ? Array.from(ids)[0] : null
                  )
                }
              />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {/* <ThinkingToggle onModelChange={onModelChange} /> */}

            {messages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNewChat}
                className="shrink-0 rounded-full group"
                type="button"
                disabled={isLoading}
              >
                <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-all" />
              </Button>
            )}
            <Button
              type={isLoading ? 'button' : 'submit'}
              size={'icon'}
              variant={'outline'}
              className={cn(isLoading && 'animate-pulse', 'rounded-full')}
              disabled={input.length === 0 && !isLoading}
              onClick={isLoading ? stop : undefined}
            >
              {isLoading ? <Square size={20} /> : <ArrowUp size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {!isWorkflow && messages.length === 0 && showEmptyScreen && (
        <EmptyScreen
          submitMessage={message => {
            handleInputChange({
              target: { value: message }
            } as React.ChangeEvent<HTMLTextAreaElement>)
          }}
          // className={cn(showEmptyScreen ? 'visible' : 'invisible')}
        />
      )}
    </form>
  )
}
