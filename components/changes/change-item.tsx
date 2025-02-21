'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronRight, DotIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { type Change } from './types'

interface ChangeItemProps {
  change: Change
}

export function ChangeItem({ change }: ChangeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
              {change.subChanges && change.subChanges.length > 0 && (
                <div className="bg-muted rounded-md  p-2 w-full text-muted-foreground  mt-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {change.subChanges.length} changes
                  </button>

                  {isExpanded && change.subChanges && (
                    <div className="pl-2 space-y-2 mt-2">
                      {change.subChanges.map(subChange => (
                        <div
                          key={subChange.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <DotIcon className="size-6 -mr-2" />
                          {subChange.action === 'changed value' ? (
                            <>
                              <span>{subChange.action}</span>
                              <span className="font-medium">
                                {subChange.description}
                              </span>
                              <span>of</span>
                              {subChange.targetLink ? (
                                <Link
                                  href={subChange.targetLink}
                                  className="font-medium hover:underline text-blue-600"
                                >
                                  {subChange.target}
                                </Link>
                              ) : (
                                <span className="font-medium">
                                  {subChange.target}
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <span>{subChange.action}</span>
                              {subChange.targetLink ? (
                                <Link
                                  href={subChange.targetLink}
                                  className="font-medium hover:underline text-blue-600"
                                >
                                  {subChange.target}
                                </Link>
                              ) : (
                                <span className="font-medium">
                                  {subChange.target}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
