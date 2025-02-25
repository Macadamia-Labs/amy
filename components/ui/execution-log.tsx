'use client'

import { useWorkflows } from '@/components/providers/workflows-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ExecutionLogProps {
  className?: string
}

export function ExecutionLog({ className }: ExecutionLogProps) {
  const { executionLog } = useWorkflows()
  const logEndRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-scroll to the bottom when new logs arrive
  useEffect(() => {
    if (logEndRef.current && isExpanded) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [executionLog, isExpanded])

  if (executionLog.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'border rounded-md bg-muted/20 overflow-hidden transition-all duration-200',
        className
      )}
    >
      <div
        className="flex justify-between items-center p-2 bg-muted/40 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Execution Log</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
            {executionLog.length} entries
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-3 text-sm font-mono overflow-auto max-h-64 space-y-1">
          {executionLog.map((log, index) => {
            // Different styling for different log types
            const isError = log.includes('ERROR:') || log.includes('FAILED:')
            const isWarning = log.includes('WARNING:')
            const isSuccess = log.includes('Completed:')
            const isExecuting = log.includes('Executing')

            const logType = isError
              ? 'error'
              : isWarning
              ? 'warning'
              : isSuccess
              ? 'success'
              : isExecuting
              ? 'info'
              : 'log'

            return (
              <div
                key={index}
                className={cn(
                  'text-xs whitespace-pre-wrap break-all px-1 py-0.5 rounded',
                  isError && 'text-red-500 bg-red-500/10',
                  isWarning && 'text-amber-500 bg-amber-500/10',
                  isSuccess && 'text-green-500 bg-green-500/10',
                  isExecuting && 'text-blue-500 bg-blue-500/10'
                )}
              >
                <span className="opacity-70">[{logType}]</span>{' '}
                {log.split('] ')[1] || log}
              </div>
            )
          })}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  )
}
