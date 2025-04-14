'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

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
import {
  attachResourceToWorkflow,
  createWorkflow
} from '@/lib/actions/workflows'
import { useAuth } from '@/lib/providers/auth-provider'
import { Workflow } from '@/lib/types/workflow'

interface Resource {
  id: string
  name: string
  type: string
}

export function CreateWorkflowDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const router = useRouter()
  const { user } = useAuth()

  // TODO: Fetch resources from your data source
  const resources: Resource[] = [
    { id: '1', name: 'Project A', type: 'project' },
    { id: '2', name: 'Document B', type: 'document' }
  ]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const instructions = formData.get('instructions') as string

    try {
      if (!user) throw new Error('User not authorized')

      const workflowData = await createWorkflow(title, instructions, user.id)
      if (!workflowData || !workflowData[0])
        throw new Error('Failed to create workflow')
      const workflow = workflowData[0] as Workflow

      // Attach selected resources
      for (const resourceId of selectedResources) {
        await attachResourceToWorkflow(workflow.id, resourceId)
      }

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
              <div className="space-y-2">
                {resources.map(resource => (
                  <div
                    key={resource.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`resource-${resource.id}`}
                      checked={selectedResources.includes(resource.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedResources([
                            ...selectedResources,
                            resource.id
                          ])
                        } else {
                          setSelectedResources(
                            selectedResources.filter(id => id !== resource.id)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`resource-${resource.id}`}>
                      {resource.name} ({resource.type})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create workflow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
