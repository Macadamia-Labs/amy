'use server'

import { createClient } from '@/lib/supabase/server'

export async function createUserProfile(userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_profiles')
    .insert({ user_id: userId })

  if (error) throw error
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}
