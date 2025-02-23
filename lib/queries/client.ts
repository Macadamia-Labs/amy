import { createClient } from '@/lib/supabase/client'
import { Chat, Report } from '@/lib/types/database'

const supabase = createClient()

// Chat queries used in chats-provider
export async function getChats(): Promise<Chat[]> {
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
      .select(
        `
        *,
        chat_files:chat_files(
          file:files(*)
        )
      `
      )
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false })

    if (error) throw error
    return data.map(chat => ({
      ...chat,
      files: chat.chat_files?.map((cf: any) => cf.file) || []
    })) as Chat[]
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function createChat(
  chat: Omit<Chat, 'id' | 'created_at'>
): Promise<Chat | null> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .insert(chat)
      .select()
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    console.error('Error creating chat:', error)
    return null
  }
}

export async function deleteChat(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('chats').delete().eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting chat:', error)
  }
}

export async function updateChatTitle(
  chatId: string,
  newTitle: string
): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .update({ title: newTitle })
    .eq('id', chatId)

  if (error) {
    console.error('Error updating chat title:', error)
    throw error
  }
}

export async function bulkDeleteChats(chatIds: string[]): Promise<void> {
  const { error } = await supabase.from('chats').delete().in('id', chatIds)

  if (error) {
    console.error('Error bulk deleting chats:', error)
    throw error
  }
}

// Report queries used in reports-provider
export async function getReports(): Promise<Report[]> {
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
  try {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw error
  } catch (error) {
    console.error('Error deleting report:', error)
  }
}

export async function deleteResource(id: string): Promise<void> {
  try {
    console.log('Deleting resource:', id)
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching resource:', fetchError)
      throw fetchError
    }

    // Delete the file from storage if it exists
    if (resource?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('resources')
        .remove([resource.file_path])

      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
      }
    }

    // Delete the resource record
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
  } catch (error) {
    console.error('Error deleting resource:', error)
    throw error
  } finally {
    console.log('Resource deleted successfully')
  }
}

export async function shareResource(id: string): Promise<string> {
  try {
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!resource?.file_path) throw new Error('Resource not found')

    // Create a signed URL that expires in 24 hours
    const { data, error: signError } = await supabase.storage
      .from('resources')
      .createSignedUrl(resource.file_path, 24 * 60 * 60)

    if (signError) throw signError
    if (!data?.signedUrl) throw new Error('Failed to create share link')

    return data.signedUrl
  } catch (error) {
    console.error('Error sharing resource:', error)
    throw error
  }
}
