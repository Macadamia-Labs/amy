import { Badge } from '@/components/ui/badge'

interface ChangeStatusBadgeProps {
  status: string | undefined
}

export function ChangeStatusBadge({ status }: ChangeStatusBadgeProps) {
  if (!status) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FAILING':
        return 'bg-red-100 text-red-800'
      case 'PASSING':
        return 'bg-green-100 text-green-800'
      case 'NOT_CHECKED':
        return 'bg-gray-100 text-gray-800'
      case 'up to date':
        return 'bg-blue-100 text-blue-800'
      case 'outdated':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Badge className={getStatusColor(status)} variant="outline">
      {status}
    </Badge>
  )
}
