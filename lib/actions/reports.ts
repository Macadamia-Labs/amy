'use server'

import { createClient } from '@/lib/supabase/server'
import { Report } from '@/lib/types/database'

export async function getReports(): Promise<Report[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('You must be logged in to view reports')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Report[]
  } catch (error) {
    console.error('Error fetching reports:', error)
    return []
  }
}

export async function deleteReport(id: string): Promise<void> {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw error
  } catch (error) {
    console.error('Error deleting report:', error)
  }
}
