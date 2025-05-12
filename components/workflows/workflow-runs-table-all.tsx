'use client'

import LoadingDots from '@/components/magicui/loading-dots'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  deleteWorkflowRun,
  getAllWorkflowRunsWithNames
} from '@/lib/actions/workflows'
import { useAuth } from '@/lib/providers/auth-provider'
import { Check, Loader2, Trash2, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from './ui/skeleton'

export function WorkflowRunsTableAll() {
  const { user } = useAuth()
  const [runs, setRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null)
  const [downloadingRunId, setDownloadingRunId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRuns() {
      if (!user?.id) return
      setLoading(true)
      try {
        const data = await getAllWorkflowRunsWithNames(user.id)
        setRuns(data)
      } catch (e) {
        toast.error('Failed to fetch workflow runs')
      } finally {
        setLoading(false)
      }
    }
    fetchRuns()
  }, [user])

  const handleDeleteRun = async (runId: string) => {
    setDeletingRunId(runId)
    try {
      await deleteWorkflowRun(runId)
      toast.success('Workflow run deleted successfully.')
      setRuns(prev => prev.filter(r => r.id !== runId))
    } catch (error) {
      console.error('Failed to delete workflow run:', error)
      toast.error('Failed to delete workflow run.')
    } finally {
      setDeletingRunId(null)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">All Workflow Runs</CardTitle>
        <CardDescription>
          This table shows all workflow runs, grouped by workflow name.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px] whitespace-nowrap">
                Workflow Run
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && runs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ) : runs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-4"
                >
                  No workflow runs found.
                </TableCell>
              </TableRow>
            ) : (
              runs.map((w, idx, arr) => {
                // Find the run number for this workflow (count of runs for this workflow up to this point)
                const workflowRuns = arr.filter(
                  r => r.workflow_id === w.workflow_id
                )
                const runIndex = workflowRuns.findIndex(r => r.id === w.id)
                const runNumber = workflowRuns.length - runIndex
                const isCompleted = w.status === 'completed'
                const canDownload = isCompleted && w.output_resource_id
                const isDeleting = deletingRunId === w.id
                const isDownloading = downloadingRunId === w.id
                return (
                  <TableRow key={w.id}>
                    <TableCell className="min-w-[180px] whitespace-nowrap">{`${w.workflow_title} #${runNumber}`}</TableCell>
                    <TableCell>
                      {w.status === 'processing' ? (
                        <Badge className="bg-yellow-500 text-white hover:bg-yellow-500 focus:bg-yellow-500/50 active:bg-yellow-500/50">
                          <p className="flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing <LoadingDots />
                          </p>
                        </Badge>
                      ) : w.status === 'error' ? (
                        <Badge className="bg-red-500 text-white hover:bg-red-500 focus:bg-red-500/50 active:bg-red-500/50">
                          <p className="flex items-center">
                            <XIcon className="w-4 h-4 mr-1" />
                            Error
                          </p>
                        </Badge>
                      ) : w.status === 'completed' ? (
                        <Badge className="bg-green-500 text-white hover:bg-green-500 focus:bg-green-500/50 active:bg-green-500/50">
                          <p className="flex items-center">
                            <Check className="w-4 h-4 mr-1" />
                            Completed
                          </p>
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-foreground hover:bg-muted focus:bg-muted active:bg-muted">
                          {typeof w.status === 'string' &&
                          (w.status as string).length > 0
                            ? (w.status as string).charAt(0).toUpperCase() +
                              (w.status as string).slice(1)
                            : 'Unknown'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                            {w.status_message}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {w.status_message}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {new Date(w.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isDeleting || isDownloading}
                        onClick={() => handleDeleteRun(w.id)}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
