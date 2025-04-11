'use client'

import { useChatId } from '@/lib/hooks/use-chat-id'
import { useChat } from 'ai/react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../lib/utils'
import { ChatShare } from './chat-share'
import { Button } from './ui/button'

interface MessageActionsProps {
  message: string
  enableShare?: boolean
  className?: string
}

export function MessageActions({
  message,
  enableShare,
  className
}: MessageActionsProps) {
  const { chatId } = useChatId()
  const { isLoading } = useChat({
    id: chatId
  })
  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    toast.success('Message copied to clipboard')
  }

  if (isLoading) {
    return <div className="size-10" />
  }

  return (
    <div className={cn('flex items-center gap-0.5 self-end', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="rounded-full"
      >
        <Copy size={14} />
      </Button>
      {enableShare && chatId && <ChatShare chatId={chatId} />}
    </div>
  )
}
