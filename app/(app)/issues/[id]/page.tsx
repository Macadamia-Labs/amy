'use client'

import { Comments } from '@/components/comments'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { sampleIssues } from '@/data/issues'
import { cn } from '@/lib/utils'
import {
  getCategoryIcon,
  getPriorityColor,
  getPriorityIcon,
  getStatusColor,
  getStatusIcon
} from '@/lib/utils/issue-helpers'
import { getResourceSourceIcon } from '@/lib/utils/resource-helpers'
import 'katex/dist/katex.min.css'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Preprocess LaTeX equations to be rendered by KaTeX
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}

export default function IssuePage() {
  const params = useParams()
  const issue = sampleIssues.find(i => i.id === params.id)

  if (!issue) {
    return <div>Issue not found</div>
  }

  const StatusIcon = getStatusIcon(issue.status)
  const CategoryIcon = getCategoryIcon(issue.category)

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/issues">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Issues
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{issue.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-muted-foreground text-lg">
              <div className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                <span>{issue.category}</span>
              </div>
              <span
                className={cn(
                  'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2',
                  getStatusColor(issue.status)
                )}
              >
                <StatusIcon className="h-5 w-5" />
                {issue.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
              getPriorityColor(issue.priority)
            )}
          >
            {getPriorityIcon(issue.priority)({ className: 'h-4 w-4' })}
            {issue.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Detected Problem</h2>
              <MemoizedReactMarkdown>
                {preprocessLaTeX(issue.description)}
              </MemoizedReactMarkdown>
            </CardContent>
          </Card>

          {/* Proposed Solution */}
          {issue.proposedSolution && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Proposed Solution
                </h2>
                <div className="text-muted-foreground text-lg">
                  <MemoizedReactMarkdown>
                    {preprocessLaTeX(issue.proposedSolution)}
                  </MemoizedReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Resources */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>
              <div className="space-y-1">
                {issue.resources.map(resource => (
                  <Link key={resource.id} href={`/resources/${resource.id}`}>
                    <div className="flex items-center gap-4 p-2 px-3 hover:bg-muted rounded">
                      {getResourceSourceIcon(resource)}
                      <div>
                        <span className="font-medium">{resource.title}</span>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Comments
            comments={
              issue.comments?.map(comment => ({
                id: comment.id,
                content: comment.content,
                author: {
                  name: comment.author.name
                },
                createdAt: new Date(comment.createdAt).toLocaleDateString()
              })) || []
            }
          />
        </div>
      </div>
    </div>
  )
}
