import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Issue } from '@/lib/types'
import { cn } from '@/lib/utils'
import { UserIcon } from '@/lib/utils/icons'
import {
  getCategoryIcon,
  getStatusColor,
  getStatusIcon
} from '@/lib/utils/issue-helpers'
import { useRouter } from 'next/navigation'
import { IssuePriorityBadge } from './issue-priority-badge'

interface IssueTableProps {
  issues: Issue[]
}

export function IssueTable({ issues }: IssueTableProps) {
  const router = useRouter()

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Priority</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map(issue => {
            const StatusIcon = getStatusIcon(issue.status)
            const CategoryIcon = getCategoryIcon(issue.category)

            return (
              <TableRow
                key={issue.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push(`/issues/${issue.id}`)}
              >
                <TableCell>
                  <IssuePriorityBadge priority={issue.priority} />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">{issue.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    {issue.category}
                  </div>
                </TableCell>
                <TableCell>
                  {issue.assignedEngineer && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm">
                          {issue.assignedEngineer.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {issue.assignedEngineer.specialty}
                        </div>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2 w-fit',
                      getStatusColor(issue.status)
                    )}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {issue.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>{issue.updatedAt.toLocaleDateString()}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
