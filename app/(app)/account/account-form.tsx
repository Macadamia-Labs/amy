'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateUserProfile } from '@/lib/actions/users'
import { useAuth } from '@/lib/providers/auth-provider'
import { useState } from 'react'
import { toast } from 'sonner'

interface AccountFormProps {
  initialData?: {
    name: string | null
    company: string | null
  }
}

export function AccountForm({ initialData }: AccountFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || ''
  })
  const { user } = useAuth()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!user) {
        throw new Error('User not found')
      }

      await updateUserProfile(user.id, {
        name: formData.name,
        company: formData.company
      })

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company Description</Label>
        <Textarea
          id="company"
          value={formData.company}
          onChange={e => setFormData({ ...formData, company: e.target.value })}
          placeholder="Enter your company description"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
