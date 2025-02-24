'use client'

import { Comments } from '@/components/comments'
import { IssueCategoryBadge } from '@/components/issues/issue-category-badge'
import { IssuePriorityBadge } from '@/components/issues/issue-priority-badge'
import { IssueStatusBadge } from '@/components/issues/issue-status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { sampleIssues } from '@/data/issues'
import { getResourceSourceIcon } from '@/lib/utils/resource-helpers'
import 'katex/dist/katex.min.css'
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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{issue.title}</h1>

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
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className=" text-sm font-medium mr-auto">Priority</span>
                  <IssuePriorityBadge priority={issue.priority} />
                </div>
                <div className="flex items-center gap-2">
                  <span className=" text-sm font-medium mr-auto">Status</span>
                  <IssueStatusBadge status={issue.status} />
                </div>
                <div className="flex items-center gap-2">
                  <span className=" text-sm font-medium mr-auto">Category</span>
                  <IssueCategoryBadge category={issue.category} />
                </div>
              </div>
            </CardContent>
          </Card>

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
