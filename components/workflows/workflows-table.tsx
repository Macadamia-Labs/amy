'use client'

import { useWorkflows } from '@/components/providers/workflows-provider'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable
} from '@/components/ui/table'
import { GraphWorkflowStatus } from '@/lib/types/workflow'
import { CheckedState } from '@radix-ui/react-checkbox'
import {
  CheckCircle2,
  Clock,
  FileEdit,
  Loader2,
  MoreHorizontal,
  Play,
  Trash2,
  XCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const getStatusIcon = (status: GraphWorkflowStatus, isRunning: boolean) => {
  if (isRunning)
    return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />

  switch (status) {
    case 'draft':
      return <FileEdit className="h-4 w-4 text-gray-500" />
    case 'active':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    default:
      return null
  }
}

const getStatusText = (status: GraphWorkflowStatus, isRunning: boolean) => {
  if (isRunning) return 'Running'

  switch (status) {
    case 'draft':
      return 'Draft'
    case 'active':
      return 'Active'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    case 'running':
      return 'Running'
    default:
      return status
  }
}

export function GraphWorkflowsTable() {
  const { workflows, removeWorkflow, executeWorkflow, runningWorkflows } =
    useWorkflows()
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedIds.size === workflows.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(workflows.map(w => w.id)))
    }
    setLastSelectedId(null)
  }

  const handleCheckboxChange = (
    id: string,
    checked: boolean,
    shiftKey: boolean
  ) => {
    const newSelected = new Set(selectedIds)

    if (shiftKey && lastSelectedId) {
      const lastIndex = workflows.findIndex(w => w.id === lastSelectedId)
      const currentIndex = workflows.findIndex(w => w.id === id)
      const [start, end] = [lastIndex, currentIndex].sort((a, b) => a - b)

      workflows.slice(start, end + 1).forEach(workflow => {
        if (checked) {
          newSelected.add(workflow.id)
        } else {
          newSelected.delete(workflow.id)
        }
      })
    } else {
      if (checked) {
        newSelected.add(id)
      } else {
        newSelected.delete(id)
      }
    }

    setSelectedIds(newSelected)
    setLastSelectedId(id)
  }

  const handleDelete = async (id: string) => {
    try {
      await removeWorkflow(id)
      toast.success('Workflow deleted successfully')
    } catch (error) {
      console.error('Error deleting workflow:', error)
      toast.error('Failed to delete workflow')
    }
  }

  const handleExecute = async (id: string) => {
    try {
      await executeWorkflow(id)
      toast.success('Workflow execution completed')
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow')
    }
  }

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        removeWorkflow(id)
      )
      await Promise.all(deletePromises)
      setSelectedIds(new Set())
      toast.success('Selected workflows deleted successfully')
    } catch (error) {
      console.error('Error deleting workflows:', error)
      toast.error('Failed to delete some workflows')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Workflows</h2>
          <p className="text-muted-foreground">
            Create and manage custom engineering workflows
          </p>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.size})
            </Button>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 h-full">
            <div className="mb-2 font-medium">No workflows found</div>
            <p className="text-sm text-muted-foreground text-center">
              Get started by creating your first workflow.
            </p>
          </div>
        ) : (
          <UITable>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedIds.size === workflows.length &&
                      workflows.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map(workflow => {
                const isRunning = runningWorkflows.has(workflow.id)

                return (
                  <TableRow
                    key={workflow.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/workflows/${workflow.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {workflow.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {workflow.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workflow.status, isRunning)}
                        <span className="text-sm">
                          {getStatusText(workflow.status, isRunning)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(workflow.last_run)}</TableCell>
                    <TableCell>{formatDate(workflow.created_at)}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleExecute(workflow.id)}
                            disabled={isRunning}
                          >
                            {isRunning ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Execute
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(workflow.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(workflow.id)}
                        onCheckedChange={(checked: CheckedState) => {
                          handleCheckboxChange(
                            workflow.id,
                            checked === true,
                            (window.event as MouseEvent)?.shiftKey ?? false
                          )
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </UITable>
        )}
      </div>
    </div>
  )
}
