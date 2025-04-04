'use server'

import { createClient } from '@/lib/supabase/server'
import { FileRecord } from '@/lib/types/database'

export async function getFiles(): Promise<FileRecord[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('You must be logged in to view files')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as FileRecord[]
  } catch (error) {
    console.error('Error fetching files:', error)
    return []
  }
}
