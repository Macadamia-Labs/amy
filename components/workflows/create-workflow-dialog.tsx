'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { SmallResourceCard } from '@/app/(app)/workflows/[id]/resources-card'
import { ResourcesSelector } from '@/components/resources/resources-selector'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createWorkflow } from '@/lib/actions/workflows'
import { useAuth } from '@/lib/providers/auth-provider'
import { useResources } from '../providers/resources-provider'
export function CreateWorkflowDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { resources } = useResources()
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set()
  )
  const selectedResources = resources.filter(resource =>
    selectedResourceIds.has(resource.id)
  )
  const router = useRouter()
  const { user } = useAuth()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const instructions = formData.get('instructions') as string

    try {
      if (!user) throw new Error('User not authorized')

      const workflow = await createWorkflow(
        title,
        description,
        instructions,
        user.id,
        Array.from(selectedResourceIds)
      )

      setOpen(false)
      toast.success('Success', {
        description: 'Workflow created successfully'
      })

      router.push(`/workflows/${workflow.id}`)
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to create workflow'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create workflow</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workflow</DialogTitle>
          <DialogDescription>
            Add a new workflow to automate your tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter workflow title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter workflow description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                placeholder="Enter workflow instructions"
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Linked Resources</Label>
              {selectedResources.map((resource: any) => (
                <SmallResourceCard key={resource.id} resource={resource} />
              ))}
              <ResourcesSelector
                selectedIds={selectedResourceIds}
                onSelect={setSelectedResourceIds}
                trigger={
                  <Button variant="secondary" className="w-full rounded-lg">
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg w-full"
            >
              {isLoading ? 'Creating...' : 'Create workflow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
