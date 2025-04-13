'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'
import { Message } from 'ai'
import equal from 'fast-deep-equal'
import { AnimatePresence, motion } from 'framer-motion'
import { memo } from 'react'
import { PreviewAttachment } from '../chat/input/preview-attachment'
import { MemoizedReactMarkdown } from '../ui/markdown'
import { ToolMessage } from './tool-message'

interface ContentItem {
  text?: string
  type: string
  fileId?: string
}

function extractTextContent(content: Message['content']): string {
  if (typeof content === 'string') return content
  return (content as ContentItem[])
    .filter((item: ContentItem) => item.type === 'text')
    .map((item: ContentItem) => item.text || '')
    .join('\n')
}

const PurePreviewMessage = ({
  chatId,
  message,
  append,
  messages,
  setMessages,
  addToolResult
}: {
  chatId: string
  message: Message

  messages: Message[]
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  append: (message: Message) => Promise<string | null | undefined>
  isLoading?: boolean
  isReadonly?: boolean
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
}) => {
  if (
    !message.content &&
    (!message.toolInvocations || message.toolInvocations.length == 0)
  )
    return null

  const handleRestore = () => {
    const messageIndex = messages.findIndex(m => m.id === message.id)
    if (messageIndex !== -1) {
      setMessages(messages.slice(0, messageIndex + 1))
    }
  }

  return (
    <AnimatePresence>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              'flex gap-4  w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl'
            )}
          >
            <div className="flex flex-col gap-2 w-full">
              {message.experimental_attachments && (
                <div className="flex flex-row gap-2 overflow-x-auto w-full pb-2">
                  <div className="flex flex-row gap-2 min-w-fit">
                    {message.experimental_attachments.map(attachment => (
                      <div key={attachment.url} className="w-[200px] sm:w-auto">
                        <PreviewAttachment
                          attachment={attachment}
                          isInChat={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message.content && (
                <div
                  className={cn(
                    'group relative rounded-xl px-4 py-2 w-fit rounded-br-none',
                    message.role === 'user' ? 'ml-auto bg-muted' : 'mr-auto'
                  )}
                >
                  <MemoizedReactMarkdown>
                    {extractTextContent(message.content)}
                  </MemoizedReactMarkdown>
                </div>
              )}

              {message.toolInvocations &&
                message.toolInvocations.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {message.toolInvocations.map(toolInvocation => (
                      <ToolMessage
                        key={toolInvocation.toolCallId}
                        chatId={chatId}
                        toolInvocation={toolInvocation}
                        append={append}
                        addToolResult={addToolResult}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleRestore}>
            Restore chat to this message
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </AnimatePresence>
  )
}

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.message.content !== nextProps.message.content) return false
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations
      )
    )
      return false

    return true
  }
)

export const ThinkingMessage = () => {
  const role = 'assistant'

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-2 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true
          }
        )}
      >
        <div className="flex flex-col gap-2 w-full px-2 text-muted-foreground">
          Thinking...
        </div>
      </div>
    </motion.div>
  )
}
