import { Issue } from '@/lib/types'
import { NotesIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { MemoizedReactMarkdown } from '../ui/markdown'
import { IssueCategoryBadge } from './issue-category-badge'
import { IssuePriorityBadge } from './issue-priority-badge'

interface IssueCardProps {
  issue: Issue
  onClick?: () => void
  className?: string
}

export function IssueCard({ issue, onClick, className = '' }: IssueCardProps) {
  return (
    <div
      className={`h-full rounded-xl border shadow flex flex-col ${
        onClick
          ? 'cursor-pointer hover:border-primary/50 transition-colors'
          : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 pb-2">
          {/* <IssueCategoryBadge category={issue.category} /> */}
          <span className="text-lg text-muted-foreground font-bold mr-auto">
            #{issue.id}
          </span>
          <IssueCategoryBadge category={issue.category} />
          <IssuePriorityBadge priority={issue.priority} />
        </div>
        <h3 className="text-lg font-semibold">{issue.title}</h3>

        <MemoizedReactMarkdown className="text-sm line-clamp-3">
          {issue.description}
        </MemoizedReactMarkdown>
      </div>
      {issue.resources.length > 0 && (
        <div className="border-t pt-4 p-6 bg-muted rounded-b-xl flex-1">
          <div className="space-y-4">
            {issue.resources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Related Resources</h4>
                <div className="space-y-1">
                  {issue.resources.map(resource => (
                    <Link
                      key={resource.id}
                      href={`/resources/${resource.id}`}
                      className="flex items-center gap-2 text-sm hover:font-medium"
                    >
                      <NotesIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
