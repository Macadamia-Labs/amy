import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Issue } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CheckCircleIcon, NotesIcon, UserIcon } from '@/lib/utils/icons'
import { getCategoryIcon, getPriorityColor } from '@/lib/utils/issue-helpers'
import { MemoizedReactMarkdown } from '../ui/markdown'

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const CategoryIcon = getCategoryIcon(issue.category)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <CategoryIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getPriorityColor(issue.priority)
            )}
          >
            {issue.priority}
          </span>
          {issue.assignedEngineer && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span className="text-xs">{issue.assignedEngineer.name}</span>
            </div>
          )}
          <CheckCircleIcon className="size-6 text-green-500 ml-auto" />
        </div>
        {/* <div className="flex items-center gap-2 mt-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {issue.location}
          </span>
        </div> */}
        <CardTitle className="text-lg mt-2">{issue.title}</CardTitle>
        <MemoizedReactMarkdown className="text-xs line-clamp-3">
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
                  <div
                    key={resource.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <NotesIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
