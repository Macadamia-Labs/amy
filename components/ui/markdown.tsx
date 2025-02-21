import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import Image from 'next/image'
import { DetailedHTMLProps, FC, ImgHTMLAttributes, memo, useState } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

type MarkdownImageProps = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'ref'
> &
  ReactMarkdownProps

const MarkdownImage: FC<MarkdownImageProps> = ({ src = '', alt, ...props }) => {
  const [showDialog, setShowDialog] = useState(false)
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

    const maxWidth = Math.min(1200, window.innerWidth * 0.9)
    const maxHeight = window.innerHeight * 0.9

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

  return (
    <>
      <div
        className="relative"
        style={{
          width: '100%',
          aspectRatio: dimensions
            ? dimensions.width / dimensions.height
            : 'auto'
        }}
      >
        <Image
          src={src}
          alt={alt || ''}
          className="rounded-md cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowDialog(true)}
          fill
          style={{ objectFit: 'contain' }}
          sizes="100vw"
          onLoad={handleImageLoad as any}
          {...props}
        />
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="p-2 overflow-hidden" style={getDialogSize()}>
          <DialogHeader className="sr-only">
            <DialogTitle>{alt || 'Image Preview'}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt || 'Image preview'}
              className="rounded-md"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
          </div>
          {alt && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {alt}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
MarkdownImage.displayName = 'MarkdownImage'

const MarkdownWrapper: FC<Options> = ({ components, ...props }) => (
  <ReactMarkdown
    components={{
      img: MarkdownImage,
      ...components
    }}
    {...props}
  />
)
MarkdownWrapper.displayName = 'MarkdownWrapper'

export const MemoizedReactMarkdown: FC<Options> = memo(
  MarkdownWrapper,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)
