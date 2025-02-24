'use client'
import { ChevronDown, ChevronRight, Dot } from 'lucide-react'
import { useState } from 'react'
import { AnimatedShinyText } from '../magicui/animated-shiny-text'
import LoadingDots from '../magicui/loading-dots'

interface Activity {
  id: string
  status: string
  description: string
}

interface ActivityDropdownProps {
  activities?: Activity[]
  isProcessing?: boolean
}

export function ActivityDropdown({
  activities = [],
  isProcessing = false
}: ActivityDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Only return null if we have no activities and we're not processing
  if (!activities.length && !isProcessing) return null

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
        <AnimatedShinyText>
          Performing actions
          <LoadingDots />
        </AnimatedShinyText>
      </button>

      {isExpanded && (
        <div className="pl-2 space-y-2 mt-2">
          {Array.isArray(activities) &&
            activities.map((activity, index) => (
              <div
                key={activity?.id || `activity-${index}`}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Dot className="h-4 w-4" />
                <span className="font-medium">
                  {activity?.description || 'Unknown activity'}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
