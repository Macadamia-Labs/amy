'use client'

import { PreviewAttachment } from '@/components/chat/input/preview-attachment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/providers/auth-provider'
import { cn } from '@/lib/utils'
import { ArrowUpCircleIcon } from '@/lib/utils/icons'
import type { Attachment, ChatRequestOptions, Message } from 'ai'
import equal from 'fast-deep-equal'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type React from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react'
import { toast } from 'sonner'

interface UploadQueueItem {
  name: string
  contentType: string
}

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  uploadQueue,
  setUploadQueue,
  messages,
  setMessages,
  append,
  handleSubmit
}: {
  chatId: string
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  uploadQueue: Array<UploadQueueItem>
  setUploadQueue: Dispatch<SetStateAction<Array<UploadQueueItem>>>
  messages: Array<Message>
  setMessages: Dispatch<SetStateAction<Array<Message>>>
  append: (
    message: Message,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [localInput, setLocalInput] = useState(input)

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      const finalValue = domValue || input || ''
      setInput(finalValue)
      adjustHeight()
    }
  }, [])

  useEffect(() => {
    setLocalInput(input)
  }, [input])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const submitForm = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      handleSubmit(event, {
        experimental_attachments: attachments
      })

      setAttachments([])
      setLocalInput('')
      resetHeight()
      textareaRef.current?.focus()
    },
    [attachments, handleSubmit, setAttachments]
  )

  const { session } = useAuth()

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      if (files.length === 0) return

      // Clear the file input
      event.target.value = ''

      // Add files to upload queue immediately
      const newUploadQueue = files.map(file => ({
        name: file.name,
        contentType: file.type
      }))

      setUploadQueue(prev => [...prev, ...newUploadQueue])

      try {
        // Remove files from queue after processing
        setUploadQueue(prev =>
          prev.filter(item => !files.some(f => f.name === item.name))
        )

        toast.error('File upload functionality not implemented')
      } catch (error) {
        console.error('Error uploading files:', error)
        toast.error('Failed to upload one or more files')
        setUploadQueue(prev =>
          prev.filter(item => !files.some(f => f.name === item.name))
        )
      }
    },
    [chatId, setAttachments, setUploadQueue, input, setInput]
  )

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col gap-2">
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
        autoFocus
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="absolute bottom-full left-0 right-0 flex flex-wrap gap-2 items-end px-2 mb-2 z-10">
          {attachments.map(attachment => (
            <PreviewAttachment
              key={attachment.url}
              attachment={attachment}
              onDelete={() => {
                setAttachments(prev =>
                  prev.filter(a => a.url !== attachment.url)
                )
              }}
            />
          ))}

          {uploadQueue.map(item => (
            <PreviewAttachment
              key={item.name}
              attachment={{
                name: item.name,
                contentType: item.contentType
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cn(
          'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none !text-base bg-background pt-4 pb-10 font-medium'
        )}
        rows={2}
        autoFocus
        onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            if (isLoading) {
              toast.error('Please wait for the model to finish its response!')
            } else {
              submitForm()
            }
          }
        }}
      />

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end gap-2 items-center">
        {isLoading ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton
            input={input}
            submitForm={submitForm}
            uploadQueue={uploadQueue}
          />
        )}
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false
    if (!equal(prevProps.uploadQueue, nextProps.uploadQueue)) return false

    return true
  }
)

function PureStopButton({
  stop,
  setMessages
}: {
  stop: () => void
  setMessages: Dispatch<SetStateAction<Array<Message>>>
}) {
  return (
    <Button
      className="rounded-full p-1.5 size-8 border group relative"
      onClick={event => {
        event.preventDefault()
        stop()
        setMessages(messages => messages)
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader2 className="size-6 animate-spin group-hover:opacity-0 transition-opacity" />
      </motion.div>
    </Button>
  )
}

const StopButton = memo(PureStopButton)

function PureSendButton({
  submitForm,
  input,
  uploadQueue
}: {
  submitForm: () => void
  input: string
  uploadQueue: Array<UploadQueueItem>
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border"
      onClick={event => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpCircleIcon className="size-6" />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input) return false
  return true
})
