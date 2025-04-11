'use client'

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
import { updateProject } from '@/lib/actions/projects'
import { Project } from '@/lib/types/database'
import { PencilIcon } from '@/lib/utils/icons'

interface EditProjectDialogProps {
  project: Project
  trigger?: React.ReactNode
}

export function EditProjectDialog({
  project,
  trigger
}: EditProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(project.name)
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState(project.color || 'blue')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Project name cannot be empty')
      return
    }

    setLoading(true)

    const result = await updateProject(project.id, { name, color })

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Project updated successfully')
      router.refresh()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Change the name and color of your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                id="name"
                placeholder="Project name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
              <div className="flex gap- justify-between py-2 px-4">
                {[
                  'red',
                  'green',
                  'blue',
                  'yellow',
                  'purple',
                  'orange',
                  'pink',
                  'teal'
                ].map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`w-6 h-6 rounded-full bg-${c}-500 ${
                      color === c ? 'ring-2 ring-offset-2 ring-${c}-500' : ''
                    }`}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProjectDialog
