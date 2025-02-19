'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CheckSquareIcon, XSquareIcon } from '@/lib/utils/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface BaseToolResultProps {
  tool: any
  title: string
  loadingTitle?: string
  successTitle?: string
  failTitle?: string
  icon?: ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  onAction?: () => void
  actionIcon?: ReactNode
  actionLabel?: string
  children?: ReactNode
  showDialog?: boolean
}

export function BaseToolResult({
  tool,
  title,
  loadingTitle,
  successTitle,
  failTitle,
  icon,
  isLoading,
  isSuccess,
  onAction,
  actionIcon,
  actionLabel,
  children,
  showDialog = false
}: BaseToolResultProps) {
  const content = (
    <div className="rounded-lg bg-muted mx-2 p-2 pl-3 pr-5 text-sm flex gap-2 w-fit h-12 items-center cursor-pointer hover:bg-muted/80">
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span className="truncate max-w-64">{loadingTitle || title}...</span>
        </>
      ) : isSuccess ? (
        <>
          {icon || <CheckSquareIcon className="size-6 text-green-500" />}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {tool.result.app}
            </span>
            <span className="truncate max-w-64">{successTitle || title}</span>
          </div>
        </>
      ) : (
        <>
          {icon || <XSquareIcon className="size-6 text-red-500" />}
          <span className="truncate max-w-64">{failTitle || title}</span>
        </>
      )}
    </div>
  )

  const wrappedContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {showDialog ? (
          <DialogTrigger asChild>{content}</DialogTrigger>
        ) : (
          content
        )}
      </motion.div>
    </AnimatePresence>
  )

  if (!showDialog && !onAction) {
    return wrappedContent
  }

  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger>{wrappedContent}</ContextMenuTrigger>
        {onAction && (
          <ContextMenuContent>
            <ContextMenuItem onClick={onAction} className="gap-2">
              {actionIcon}
              <span>{actionLabel}</span>
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
      {showDialog && (
        <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
          <div className="flex-1 min-h-0 h-full w-full p-2">{children}</div>
        </DialogContent>
      )}
    </Dialog>
  )
}
