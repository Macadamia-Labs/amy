'use client'
import { ChevronDown, ChevronRight, DotIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { type Change } from './types'

interface ChangeDropdownProps {
  subChanges: Change['subChanges']
}

export function ChangeDropdown({ subChanges }: ChangeDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!subChanges?.length) return null

  return (
    <div className="bg-muted rounded-md p-2 w-full text-muted-foreground mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {subChanges.length} changes
      </button>

      {isExpanded && (
        <div className="pl-2 space-y-2 mt-2">
          {subChanges.map(subChange => (
            <div
              key={subChange.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <DotIcon className="size-6 -mr-2" />
              {subChange.action === 'changed value' ? (
                <>
                  <span>{subChange.action}</span>
                  <span className="font-medium">{subChange.description}</span>
                  <span>of</span>
                  {subChange.targetLink ? (
                    <Link
                      href={subChange.targetLink}
                      className="font-medium hover:underline text-blue-600"
                    >
                      {subChange.target}
                    </Link>
                  ) : (
                    <span className="font-medium">{subChange.target}</span>
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
                    <span className="font-medium">{subChange.target}</span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
