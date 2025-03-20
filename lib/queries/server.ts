import { Chat, FileRecord, Project, Resource } from '@/lib/types/database'
import { createClient } from '../supabase/server'

// Project queries
export async function getProjects(app: string): Promise<Project[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('You must be logged in to view projects')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('app', app)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

// File queries used in client components
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

// Resource queries used in client components
export async function getResources(): Promise<Resource[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('You must be logged in to view resources')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Resource[]
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

export async function getRecentChats(limit: number): Promise<Chat[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('You must be logged in to view chats')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .eq('app', 'cooper')
      .order('last_message_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Chat[]
  } catch (error) {
    console.error('Error fetching recent chats:', error)
    return []
  }
}

export async function getResource(resourceId: string): Promise<Resource> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single()

  if (error) throw error
  return data as Resource
}

export async function getResourceEmbeddings(
  resourceId: string
): Promise<any[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('embeddingscooper')
    .select('*')
    .eq('resource_id', resourceId)

  if (error) throw error
  return data
}

export async function getResourceEnriched(
  resourceId: string
): Promise<Resource | null> {
  const supabase = await createClient()
  const resource = await getResource(resourceId)
  if (!resource) return null
  const { data } = await supabase.storage
    .from('resources')
    .createSignedUrl(resource.file_path, 60 * 60 * 24 * 30)

  return { ...resource, file_url: data?.signedUrl }
}

export async function updateResource(
  resourceId: string,
  updates: Partial<Resource>
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', resourceId)

  if (error) throw error
}

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
