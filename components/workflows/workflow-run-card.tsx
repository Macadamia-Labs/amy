'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSignedResourceUrl } from '@/lib/actions/resources'
import { CheckCircleIcon, LoaderIcon } from '@/lib/utils/icons'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface WorkflowRunCardProps {
  run: any
  type: 'active' | 'completed'
}

export function WorkflowRunCard({ run, type }: WorkflowRunCardProps) {
  const [downloading, setDownloading] = useState(false)

  if (type === 'active') {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted border rounded-xl">
        <div className="rounded-full bg-yellow-500 w-6 h-6 flex items-center justify-center">
          <LoaderIcon className="w-4 h-4 text-white animate-spin" />
        </div>
        <span className="font-mono text-sm font-bold">
          {run.workflow_title || 'Workflow'}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(run.created_at).toLocaleString()}
        </span>
        <div className="flex-grow" />
        <Badge className="bg-yellow-500 text-white flex items-center">
          <span className="mr-2">Processing</span>
        </Badge>
      </div>
    )
  }

  // Completed
  return (
    <div className="flex items-center gap-3 p-2 pl-4 bg-muted border rounded-xl">
      <CheckCircleIcon className="w-7 h-7 text-green-500" />
      <span className="font-mono text-sm font-bold">
        {run.workflow_title || 'Workflow'}
      </span>
      <span className="text-xs text-muted-foreground">
        {new Date(run.created_at).toLocaleString()}
      </span>
      <div className="flex-grow" />
      {typeof run.output_resource_id === 'string' && run.output_resource_id ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="ml-auto"
          disabled={downloading}
          onClick={async () => {
            setDownloading(true)
            try {
              const url = await getSignedResourceUrl(run.output_resource_id!)
              const link = document.createElement('a')
              link.href = url
              link.download = `workflow_output_${run.id || 'result'}.xlsx`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              toast.success('Download started.')
            } catch (error: any) {
              console.error('Failed to download workflow run output:', error)
              toast.error(`Failed to download file: ${error.message}`)
            } finally {
              setDownloading(false)
            }
          }}
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-1" />
          )}
          Download Result
        </Button>
      ) : null}
    </div>
  )
}
