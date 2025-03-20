import { createClient } from '@/lib/supabase/client'
import { Resource } from '@/lib/types'
import { useEffect } from 'react'

interface UseResourceChangesProps {
  userId: string | undefined
  onUpdate: (resource: Resource) => void
  onDelete: (resourceId: string) => void
}

export function useResourceChanges({
  userId,
  onUpdate,
  onDelete
}: UseResourceChangesProps) {
  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    // Subscribe to resource updates
    const subscription = supabase
      .channel('resources')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resources',
          filter: `user_id=eq.${userId}`
        },
        payload => {
          const updatedResource = payload.new as Resource
          console.log('Resource updated:', updatedResource)
          onUpdate(updatedResource)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'resources',
          filter: `user_id=eq.${userId}`
        },
        payload => {
          const newResource = payload.new as Resource
          console.log('New resource added:', newResource)
          onUpdate(newResource)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'resources',
          filter: `user_id=eq.${userId}`
        },
        payload => {
          const deletedResourceId = payload.old.id
          console.log('Resource deleted:', deletedResourceId)
          onDelete(deletedResourceId)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, onUpdate, onDelete])
}
