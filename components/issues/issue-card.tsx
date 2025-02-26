import { Issue } from '@/lib/types'
import { getResourceSourceIcon } from '@/lib/utils/resource-helpers'
import Link from 'next/link'
import { MemoizedReactMarkdown } from '../ui/markdown'
import { IssuePriorityPills } from './issue-priority-pills'

// Function to strip bold markdown formatting
const stripBoldFormatting = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1')
}

interface IssueCardProps {
  issue: Issue
  onClick?: () => void
  className?: string
}

export function IssueCard({ issue, onClick, className = '' }: IssueCardProps) {
  // Strip bold formatting from the description for the card view
  const plainDescription = stripBoldFormatting(issue.description)

  return (
    <div
      className={`h-full rounded-xl border flex flex-col transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:ring-2 hover:ring-muted-foreground/20'
          : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 pb-2">
          {/* <IssueCategoryBadge category={issue.category} /> */}
          <span className="text-lg text-muted-foreground font-bold">
            {issue.id}
          </span>
          {/* <IssueCategoryBadge category={issue.category} /> */}
          <div className="ml-auto">
            <IssuePriorityPills priority={issue.priority} />
          </div>
          {/* <IssueCategoryBadge category={issue.category} />
          <IssuePriorityBadge priority={issue.priority} /> */}
        </div>
        <h3 className="text-lg font-semibold">{issue.title}</h3>

        <MemoizedReactMarkdown className="text-sm line-clamp-3">
          {plainDescription}
        </MemoizedReactMarkdown>
      </div>
      <div className="border-t pt-4 p-6 bg-muted rounded-b-xl flex-1">
        <div className="space-y-4">
          {issue.resources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Related Resources</h4>
              {issue.resources.length > 0 ? (
                <div className="flex flex-row flex-wrap gap-2">
                  {issue.resources.map(resource => (
                    <Link
                      key={resource.id}
                      href={`/resources/${resource.id}`}
                      className="flex items-center gap-2 text-sm hover:font-medium bg-background p-2 rounded-md"
                    >
                      {getResourceSourceIcon(resource)}
                      <span>{resource.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No resources found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
