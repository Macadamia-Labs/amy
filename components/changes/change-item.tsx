'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ChangeDropdown } from './change-dropdown'
import { ChangeStatusBadge } from './change-status-badge'
import { type Change } from './types'

interface ChangeItemProps {
  change: Change
}

export function ChangeItem({ change }: ChangeItemProps) {
  return (
    <div className="space-y-2">
      <Card className="hover:border-muted-foreground/50 transition-all duration-300">
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
                <span className="font-bold text-sky-500">
                  {change.user.name}
                </span>
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
              <ChangeStatusBadge status={change.status} />
              {change.description && (
                <p className="text-sm text-muted-foreground">
                  {change.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground">
                {change.timestamp}
              </div>
              <ChangeDropdown subChanges={change.subChanges} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
