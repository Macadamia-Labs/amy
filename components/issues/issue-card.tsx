import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Issue } from '@/lib/types'
import { NotesIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { MemoizedReactMarkdown } from '../ui/markdown'
import { IssuePriorityBadge } from './issue-priority-badge'

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{issue.title}</CardTitle>
        <div className="flex items-center justify-between gap-2">
          <IssuePriorityBadge priority={issue.priority} />
        </div>
        <MemoizedReactMarkdown className="text-sm line-clamp-3">
          {issue.description}
        </MemoizedReactMarkdown>
      </CardHeader>
      <CardContent className="border-t pt-4">
        <div className="space-y-4">
          {issue.resources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Related Resources
              </h4>
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
      </CardContent>
    </Card>
  )
}
