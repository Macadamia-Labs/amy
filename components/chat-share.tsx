'use client'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { shareChat } from '@/lib/actions/chat'
import { useAuth } from '@/lib/providers/auth-provider'
import { cn } from '@/lib/utils'
import { Share } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Spinner } from './ui/spinner'

interface ChatShareProps {
  chatId: string
  className?: string
}

export function ChatShare({ chatId, className }: ChatShareProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 })
  const [shareUrl, setShareUrl] = useState('')
  const { user } = useAuth()

  const handleShare = async () => {
    if (!user) {
      toast.error('You must be logged in to share chats')
      return
    }
    
    startTransition(() => {
      setOpen(true)
    })
    const result = await shareChat(chatId, user.id)
    if (!result) {
      toast.error('Failed to share chat')
      return
    }

    if (!result.share_path) {
      toast.error('Could not copy link to clipboard')
      return
    }

    const url = new URL(result.share_path, window.location.href)
    setShareUrl(url.toString())
  }

  const handleCopy = () => {
    if (shareUrl) {
      copyToClipboard(shareUrl)
      toast.success('Link copied to clipboard')
      setOpen(false)
    } else {
      toast.error('No link to copy')
    }
  }

  return (
    <div className={className}>
      <Dialog
        open={open}
        onOpenChange={open => setOpen(open)}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
      >
        <DialogTrigger asChild>
          <Button
            className={cn('rounded-full')}
            size="icon"
            variant={'ghost'}
            onClick={() => setOpen(true)}
          >
            <Share size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link to search result</DialogTitle>
            <DialogDescription>
              Anyone with the link will be able to view this search result.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="items-center">
            {!shareUrl && (
              <Button onClick={handleShare} disabled={isPending} size="sm">
                {isPending ? <Spinner /> : 'Get link'}
              </Button>
            )}
            {shareUrl && (
              <Button onClick={handleCopy} disabled={isPending} size="sm">
                {'Copy link'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
