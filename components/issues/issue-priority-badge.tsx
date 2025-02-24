import { IssuePriority } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getPriorityColor, getPriorityIcon } from '@/lib/utils/issue-helpers'

export const IssuePriorityBadge = ({
  priority
}: {
  priority: IssuePriority
}) => {
  const PriorityIcon = getPriorityIcon(priority)
  return (
    <span
      className={cn(
        'p-1 pr-2 rounded-full text-xs font-medium flex items-center gap-2 w-fit',
        getPriorityColor(priority)
      )}
    >
      <PriorityIcon className="h-4 w-4" />
      {priority}
    </span>
  )
}
