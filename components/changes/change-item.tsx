import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { type Change } from './types'

interface ChangeItemProps {
  change: Change
}

export function ChangeItem({ change }: ChangeItemProps) {
  const getStatusColor = (status: string | undefined) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            {change.user.avatar ? (
              <AvatarImage src={change.user.avatar} alt={change.user.name} />
            ) : (
              <AvatarFallback>
                {change.user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{change.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {change.action}
              </span>
              {change.targetLink ? (
                <Link
                  href={change.targetLink}
                  className="text-sm font-medium hover:underline text-blue-600"
                >
                  {change.target}
                </Link>
              ) : (
                <span className="text-sm font-medium">{change.target}</span>
              )}
            </div>
            {change.status && (
              <Badge
                className={getStatusColor(change.status)}
                variant="outline"
              >
                {change.status}
              </Badge>
            )}
            {change.description && (
              <p className="text-sm text-muted-foreground">
                {change.description}
              </p>
            )}
            <div className="text-xs text-muted-foreground">
              {change.timestamp}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
