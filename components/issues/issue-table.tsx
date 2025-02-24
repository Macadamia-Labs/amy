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
import {
    ActivityIcon,
    BellIcon,
    CheckSquareIcon,
    ClockIcon,
    HardDriveIcon,
    StopIcon,
    UserIcon,
    WrenchIcon
} from '@/lib/utils/icons'
import { useRouter } from 'next/navigation'

interface IssueTableProps {
  issues: Issue[]
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
            <TableHead>Location</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map(issue => {
            const StatusIcon = statusIcons[issue.status]
            const CategoryIcon = categoryIcons[issue.category]
            const PriorityIcon = priorityIcons[issue.priority]

            return (
              <TableRow
                key={issue.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push(`/issues/${issue.id}`)}
              >
                <TableCell>
                  <span
                    className={cn(
                      'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2 w-fit',
                      priorityColors[issue.priority]
                    )}
                  >
                    <PriorityIcon className="h-4 w-4" />
                    {issue.priority}
                  </span>
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
                <TableCell>{issue.location}</TableCell>
                <TableCell>
                  {issue.assignedEngineer && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{issue.assignedEngineer.name}</div>
                        <div className="text-xs text-muted-foreground">{issue.assignedEngineer.specialty}</div>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2 w-fit',
                      statusColors[issue.status]
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
