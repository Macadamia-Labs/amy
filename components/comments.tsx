import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUp, ChevronDown, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Textarea } from './ui/textarea'

// Function to generate a consistent color from a string
function generateColorFromString(str: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

function NameInitials({
  name,
  className = ''
}: {
  name: string
  className?: string
}) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
  const colorClass = generateColorFromString(name)

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white size-6 text-xs ${colorClass} ${className}`}
    >
      {initials.slice(0, 1)}
    </div>
  )
}

interface Comment {
  id: string
  content: string
  author: {
    name: string
  }
  category?: string
  createdAt: Date | string
  linkedText?: string
  linkedDate?: string
  mentions?: Array<{
    name: string
  }>
}

interface CommentItemProps {
  comment: Comment
}

function CommentItem({ comment }: CommentItemProps) {
  const formatTimestamp = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <div className="space-y-4">
      {comment.category && (
        <div className="text-sm font-medium text-muted-foreground">
          {comment.category}
        </div>
      )}

      <div className="flex gap-3">
        <NameInitials name={comment.author.name} />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-sm text-muted-foreground">
              {formatTimestamp(comment.createdAt)}
            </span>
          </div>

          <div className="space-y-2">
            <p>{comment.content}</p>

            {(comment.linkedText || comment.linkedDate) && (
              <div className="flex items-center gap-2 text-sm">
                {comment.linkedText && (
                  <Link href="#" className="text-primary hover:underline">
                    {comment.linkedText}
                  </Link>
                )}
                {comment.linkedDate && (
                  <span className="text-primary">{comment.linkedDate}</span>
                )}
              </div>
            )}

            {comment.mentions && comment.mentions.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {comment.mentions.map((mention, i) => (
                  <NameInitials
                    key={i}
                    name={mention.name}
                    className="h-6 w-6 text-xs"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CommentsProps {
  comments: Comment[]
}

interface CommentInputProps {
  onSubmit: (content: string) => void
}

function CommentInput({ onSubmit }: CommentInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim())
      setComment('')
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <NameInitials name="You" />
        <div className="flex-1 relative">
          <Textarea
            placeholder="Add a comment..."
            variant="ghost"
            className="w-full bg-muted focus:bg-white focus-active:border h-12 min-h-12 focus:h-24 transition-all duration-200 align-top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          {isFocused && (
            <Button
              size="icon"
              className="size-8 absolute bottom-2 right-2"
              disabled={comment.length === 0}
              onClick={handleSubmit}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function Comments({ comments: initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const handleSubmitComment = (content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: {
        name: 'You' // This should be replaced with actual user data
      },
      createdAt: new Date()
    }
    setComments(prev => [newComment, ...prev])
  }

  return (
    <div className="w-full p-4 pt-2 rounded-lg bg-sidebar text-muted-foreground border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium">Open comments</h2>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Comment Input */}
      <CommentInput onSubmit={handleSubmitComment} />

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
