'use server'

import { createClient } from '@/lib/supabase/server'

export interface Example {
  description: string
  taggedFile: {
    type: 'image' | 'text' | 'file'
    url?: string // for image or file
    content?: string // for text
    name?: string // file name if relevant
    mimeType?: string // optional, for file type
  }
}

export interface Rule {
  id: string
  created_at: string
  text: string
  type: string
  user_id?: string
  examples?: Example[]
}

export async function getRules(): Promise<Rule[]> {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('rules')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching rules:', error)
    return []
  }

  const rules = data.map(rule => ({
    ...rule,
    examples: rule.examples ?? []
  }))

  return rules
}

export async function addRule(
  text: string,
  type: string,
  examples?: Example[]
): Promise<{ data?: Rule | null; error?: any }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('rules')
    .insert([{ text, type, user_id: user.id, examples }])
    .select()
    .single()

  if (error) {
    console.error('Error adding rule:', error)
    return { error }
  }

  return { data }
}

export async function deleteRule(id: string): Promise<{ error?: any }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('rules')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting rule:', error)
    return { error }
  }

  return {}
}

export async function bulkDeleteRules(ids: string[]): Promise<{ error?: any }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('rules')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error bulk deleting rules:', error)
    return { error }
  }

  return {}
}
