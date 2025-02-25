'use client'

import { Comments } from '@/components/comments'
import { IssueCategoryBadge } from '@/components/issues/issue-category-badge'
import { IssuePriorityBadge } from '@/components/issues/issue-priority-badge'
import { IssueStatusBadge } from '@/components/issues/issue-status-badge'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sampleIssues } from '@/data/issues'
import { BulbIcon, FireIcon, WorkflowIcon } from '@/lib/utils/icons'
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{issue.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="problem">
            <TabsList className="w-full rounded-xl">
              <TabsTrigger value="problem" className="w-full rounded-lg">
                <FireIcon className="w-4 h-4 mr-2" /> Detected Problem
              </TabsTrigger>
              <TabsTrigger value="solution" className="w-full rounded-lg">
                <BulbIcon className="w-4 h-4 mr-2" /> Proposed Solution
              </TabsTrigger>
            </TabsList>
            <TabsContent value="problem">
              {/* Description */}
              <div className="bg-muted rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-2">Detected Problem</h2>
                <MemoizedReactMarkdown>
                  {preprocessLaTeX(issue.description)}
                </MemoizedReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="solution">
              {/* Proposed Solution */}
              {issue.proposedSolution ? (
                <div className="bg-muted rounded-xl p-4">
                  <h2 className="text-2xl font-semibold mb-4">
                    Proposed Solution
                  </h2>
                  <div className="text-muted-foreground text-lg">
                    <MemoizedReactMarkdown>
                      {preprocessLaTeX(issue.proposedSolution)}
                    </MemoizedReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4  h-32 bg-muted flex items-center justify-center flex-col">
                  <h2 className="font-semibold">No Solution Proposed</h2>
                  <div className="text-muted-foreground text-sm">
                    No solution has been proposed yet. Check back later or
                    suggest a solution in the comments.
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <div className="border rounded-xl p-4">
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
          </div>

          {/* Resources */}
          <div className="border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <div className="flex flex-row flex-wrap gap-3">
              {issue.resources.map(resource => (
                <Link key={resource.id} href={`/resources/${resource.id}`}>
                  <div className="flex items-center gap-3 p-2 px-3 hover:bg-muted rounded border bg-card">
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
          </div>

          {/* Affected Workflows */}
          {issue.affectedWorkflows && issue.affectedWorkflows.length > 0 && (
            <div className="border rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-4">Affected Workflows</h2>
              <div className="space-y-2">
                {issue.affectedWorkflows.map(workflow => (
                  <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded border bg-card">
                      <div className="flex items-center">
                        <WorkflowIcon className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium">{workflow.title}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          workflow.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          workflow.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          workflow.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          workflow.status === 'running' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
