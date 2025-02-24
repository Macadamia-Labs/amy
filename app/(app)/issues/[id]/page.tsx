'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { cn } from '@/lib/utils'
import {
  ActivityIcon,
  BellIcon,
  CheckSquareIcon,
  ClockIcon,
  HardDriveIcon,
  NotesIcon,
  StopIcon,
  TextFileIcon,
  WrenchIcon
} from '@/lib/utils/icons'
import 'katex/dist/katex.min.css'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { sampleIssues } from '../data'

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

const statusIcons = {
  open: ActivityIcon,
  in_progress: ClockIcon,
  resolved: CheckSquareIcon,
  closed: CheckSquareIcon
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
}

const priorityIcons = {
  low: ClockIcon,
  medium: ActivityIcon,
  high: BellIcon,
  critical: StopIcon
}

const categoryIcons = {
  Production: WrenchIcon,
  Construction: HardDriveIcon,
  Maintenance: WrenchIcon,
  Safety: ActivityIcon
}

const documentTypeIcons = {
  Drawing: TextFileIcon,
  Simulation: WrenchIcon,
  Report: NotesIcon,
  Specification: TextFileIcon,
  Manual: TextFileIcon
}

export default function IssuePage() {
  const params = useParams()
  const issue = sampleIssues.find(i => i.id === params.id)

  if (!issue) {
    return <div>Issue not found</div>
  }

  const StatusIcon = statusIcons[issue.status]
  const CategoryIcon = categoryIcons[issue.category]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/issues">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Issues
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{issue.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CategoryIcon className="h-4 w-4" />
                <span>{issue.category}</span>
              </div>
              <span
                className={cn(
                  'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2',
                  statusColors[issue.status]
                )}
              >
                <StatusIcon className="h-4 w-4" />
                {issue.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
              priorityColors[issue.priority]
            )}
          >
            {priorityIcons[issue.priority]({ className: 'h-4 w-4' })}
            {issue.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Detected Problem</h2>
              <div className="text-muted-foreground">
                <MemoizedReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[[rehypeKatex, { output: 'html' }]]}
                  className="prose prose-sm dark:prose-invert max-w-none
                    prose-p:my-4 
                    prose-pre:my-4
                    prose-ul:my-4 
                    prose-li:my-0
                    prose-li:marker:text-muted-foreground
                    [&_.katex-display]:my-4
                    [&_.katex]:leading-tight"
                >
                  {preprocessLaTeX(issue.description)}
                </MemoizedReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Proposed Solution */}
          {issue.proposedSolution && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Proposed Solution
                </h2>
                <div className="text-muted-foreground">
                  <MemoizedReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[[rehypeKatex, { output: 'html' }]]}
                    className="prose prose-sm dark:prose-invert max-w-none
                      prose-p:my-4 
                      prose-pre:my-4
                      prose-ul:my-4 
                      prose-li:my-0
                      prose-li:marker:text-muted-foreground
                      [&_.katex-display]:my-4
                      [&_.katex]:leading-tight"
                  >
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
              <h2 className="text-lg font-semibold mb-4">Resources</h2>
              <div className="space-y-4">
                {issue.resources.map(resource => (
                  <div key={resource.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <NotesIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{resource.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {resource.description}
                    </p>
                    <div className="text-sm text-muted-foreground pl-6 flex items-center gap-2">
                      <span>Origin:</span>
                      <span className="capitalize">{resource.origin}</span>
                    </div>
                    {resource.status && (
                      <div className="text-sm text-muted-foreground pl-6 flex items-center gap-2">
                        <span>Status:</span>
                        <span className="capitalize">{resource.status}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
