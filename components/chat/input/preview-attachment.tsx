import { Dialog, DialogContent } from '@/components/ui/dialog'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { BoxIcon, TextFileIcon } from '@/lib/utils/icons'
import type { Attachment } from 'ai'
import { Loader2Icon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  isInChat = false,
  onDelete
}: {
  attachment: Partial<Attachment>
  isUploading?: boolean
  isInChat?: boolean
  onDelete?: () => void
}) => {
  const { name, url, contentType } = attachment
  const content =
    'content' in attachment ? (attachment as any).content : undefined
  const [showPreview, setShowPreview] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
  }

  const getDialogSize = () => {
    if (!dimensions) return {}

    const maxWidth = Math.min(800, window.innerWidth * 0.8)
    const maxHeight = window.innerHeight * 0.8

    const aspectRatio = dimensions.width / dimensions.height
    let width = maxWidth
    let height = width / aspectRatio

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return {
      width: `${width}px`,
      height: `${height}px`
    }
  }

  const getImageSize = () => {
    return isInChat
      ? {
          width: 'auto',
          height: 'auto',
          maxWidth: '400px',
          maxHeight: '300px',
          position: 'relative' as const
        }
      : {
          width: '100%',
          height: '100%',
          position: 'absolute' as const,
          objectFit: 'cover' as const
        }
  }

  const isImage = contentType?.startsWith('image')

  return (
    <>
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'bg-muted rounded-md relative flex flex-col items-center justify-center overflow-hidden',
            isInChat
              ? isImage
                ? 'w-auto h-auto max-h-[300px]'
                : 'w-24 h-16'
              : 'w-24 h-16 shadow-md border',
            'aspect-video'
          )}
          onClick={() => {
            if (
              !isUploading &&
              (isImage || (contentType === 'application/pdf' && content))
            ) {
              setShowPreview(true)
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            cursor: isUploading
              ? 'default'
              : !isInChat
              ? 'pointer'
              : isImage
              ? 'pointer'
              : 'default'
          }}
        >
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Loader2Icon className="animate-spin text-muted-foreground" />
            </div>
          ) : contentType ? (
            isImage ? (
              <Image
                key={url}
                src={url || ''}
                alt={name ?? 'An image attachment'}
                className="rounded-md object-cover"
                style={getImageSize()}
                width={isInChat ? 400 : 96}
                height={isInChat ? 300 : 64}
                onLoad={handleImageLoad}
              />
            ) : contentType.startsWith('application/octet-stream') ? (
              <BoxIcon className="w-8 h-8" />
            ) : (
              <TextFileIcon className="w-8 h-8" />
            )
          ) : (
            <Skeleton className="rounded-md w-24 h-16" />
          )}

          {!isInChat && onDelete && isHovered && !isUploading && (
            <div
              className="absolute inset-0 bg-muted/80 flex text-muted-foreground items-center justify-center cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <XIcon className="size-5 text-foreground" />
            </div>
          )}
        </div>
        <div
          className={cn(
            'text-xs text-muted-foreground truncate',
            isInChat ? (isImage ? 'w-auto max-w-[400px]' : 'w-24') : 'w-24',
            'text-center'
          )}
        >
          {name}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="p-4 h-full max-h-[80vh] overflow-y-auto w-full max-w-3xl">
          {isImage ? (
            <Image
              src={url || ''}
              alt={name ?? 'Image preview'}
              className="rounded-md"
              fill
              style={{ objectFit: 'contain' }}
            />
          ) : contentType === 'application/pdf' && content ? (
            <MemoizedReactMarkdown>{content}</MemoizedReactMarkdown>
          ) : content ? (
            <div className="whitespace-pre-wrap font-mono text-sm">
              {content}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
