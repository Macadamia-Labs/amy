import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import Image from 'next/image'
import React, {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  memo,
  useState
} from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { CodeBlock } from './codeblock'

type MarkdownImageProps = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'ref'
> &
  ReactMarkdownProps

const MarkdownImage: FC<MarkdownImageProps> = ({
  src = '',
  alt,
  width,
  height,
  ...props
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const [error, setError] = useState(false)

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    setError(false)
  }

  const handleImageError = () => {
    setError(true)
    setDimensions(null)
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

  // If there's an error loading the image, render as a link
  if (error) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {src}
      </a>
    )
  }

  return (
    <span className="block">
      <div
        className="relative"
        style={{
          width: '100%',
          aspectRatio: dimensions
            ? dimensions.width / dimensions.height
            : 'auto',
          minHeight: dimensions ? undefined : '100px'
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
          onError={handleImageError}
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
              onError={handleImageError}
            />
          </div>
          {alt && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {alt}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </span>
  )
}
MarkdownImage.displayName = 'MarkdownImage'

const MarkdownWrapper: FC<Options> = ({
  components,
  remarkPlugins = [],
  rehypePlugins = [],
  className,
  ...props
}) => (
  <ReactMarkdown
    className={cn(
      'prose prose-base dark:prose-invert max-w-none',
      'prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight',
      'prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4',
      'prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4',
      'prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3',
      'prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2',
      'prose-h5:text-base prose-h5:mt-4 prose-h5:mb-2',
      'prose-h6:text-base prose-h6:mt-4 prose-h6:mb-2',
      'prose-p:leading-7 prose-p:mt-4 prose-p:mb-4',
      'prose-pre:p-0 prose-pre:bg-transparent',
      'prose-ul:mt-4 prose-ul:mb-4 prose-ul:list-disc prose-ul:pl-6',
      'prose-ol:mt-4 prose-ol:mb-4 prose-ol:list-decimal prose-ol:pl-6',
      'prose-li:mt-2 prose-li:mb-2',
      'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
      'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
      'prose-strong:font-semibold',
      'prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm',
      'prose-table:w-full prose-table:border prose-table:rounded-lg prose-table:border-border',
      className
    )}
    components={{
      img: MarkdownImage,
      // Override paragraph component to handle image children differently
      p: ({ children, ...props }) => {
        // Check if the only child is an img element
        const hasOnlyImage = React.Children.toArray(children).every(
          child => React.isValidElement(child) && child.type === MarkdownImage
        )

        // If it's just an image, don't wrap in p tag
        if (hasOnlyImage) {
          return <>{children}</>
        }

        // Otherwise render as normal paragraph
        return <p {...props}>{children}</p>
      },
      // Handle code blocks
      code({ node, inline, className, children, ...props }) {
        if (children.length) {
          if (children[0] == '▍') {
            return <span className="mt-1 cursor-default animate-pulse">▍</span>
          }

          children[0] = (children[0] as string).replace('`▍`', '▍')
        }

        const match = /language-(\w+)/.exec(className || '')

        if (inline) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }

        return (
          <CodeBlock
            key={Math.random()}
            language={(match && match[1]) || ''}
            value={String(children).replace(/\n$/, '')}
            {...props}
          />
        )
      },
      // Custom table components
      table: ({ children, ...props }) => (
        <div className="w-full overflow-auto my-4">
          <table
            className="w-full border-collapse rounded-lg border border-border shadow-sm overflow-hidden"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ children, ...props }) => (
        <thead className="border-b border-border bg-muted/30" {...props}>
          {children}
        </thead>
      ),
      tbody: ({ children, ...props }) => (
        <tbody className="divide-y divide-border" {...props}>
          {children}
        </tbody>
      ),
      tr: ({ children, ...props }) => (
        <tr className="hover:bg-muted/50 transition-colors" {...props}>
          {children}
        </tr>
      ),
      th: ({ children, ...props }) => (
        <th
          className="px-4 py-3 text-left font-semibold bg-muted/50"
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, ...props }) => (
        <td className="px-4 py-3 border-border" {...props}>
          {children}
        </td>
      ),
      ...components
    }}
    remarkPlugins={[remarkGfm, remarkMath, ...remarkPlugins]}
    rehypePlugins={[
      [rehypeKatex, { output: 'html' }],
      [rehypeExternalLinks, { target: '_blank' }],
      ...rehypePlugins
    ]}
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
