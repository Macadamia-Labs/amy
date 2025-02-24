import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IssuePriority } from '@/lib/types'

interface IssuePriorityPillsProps {
  priority: IssuePriority
}

export function IssuePriorityPills({ priority }: IssuePriorityPillsProps) {
  // Define the pill colors based on priority
  const getPillColors = () => {
    switch (priority) {
      case 'low':
        return [
          'bg-blue-500', // 1 blue
          'bg-muted',
          'bg-muted',
          'bg-muted' // 3 muted
        ]
      case 'medium':
        return [
          'bg-blue-500',
          'bg-blue-500', // 2 blue
          'bg-yellow-500',
          'bg-yellow-500' // 2 yellow
        ]
      case 'high':
        return [
          'bg-orange-500',
          'bg-orange-500',
          'bg-orange-500', // 3 orange
          'bg-muted' // 1 muted
        ]
      case 'critical':
        return [
          'bg-red-500',
          'bg-red-500',
          'bg-red-500',
          'bg-red-500' // 4 red
        ]
      default:
        return ['bg-muted', 'bg-muted', 'bg-muted', 'bg-muted']
    }
  }

  const pillColors = getPillColors()

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {pillColors.map((color, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full ${color}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">Priority: {priority}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
