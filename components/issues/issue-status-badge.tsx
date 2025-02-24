import { IssueStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getStatusColor, getStatusIcon } from '@/lib/utils/issue-helpers'

export const IssueStatusBadge = ({ status }: { status: IssueStatus }) => {
  const StatusIcon = getStatusIcon(status)
  return (
    <span
      className={cn(
        'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2 w-fit',
        getStatusColor(status)
      )}
    >
      <StatusIcon className="h-4 w-4" />
      {status}
    </span>
  )
}
