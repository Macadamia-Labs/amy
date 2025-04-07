'use server'

import { createClient } from '@/lib/supabase/server'
import { Chat } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false })

    if (error) throw error
    return data as Chat[]
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function getChat(id: string, userId: string = 'anonymous') {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    console.error('Error fetching chat:', error)
    return null
  }
}

export async function clearChats(
  userId: string = 'anonymous'
): Promise<{ error?: string }> {
  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
    revalidatePath('/')
    redirect('/')
    return {}
  } catch (error) {
    console.error('Error clearing chats:', error)
    return { error: 'Failed to clear chats' }
  }
}

export async function saveChat(chat: Chat, userId: string = 'anonymous') {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from('chats').upsert({
      ...chat,
      user_id: userId,
      last_message_at: new Date().toISOString()
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error saving chat:', error)
    throw error
  }
}

export async function getSharedChat(id: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .eq('is_shared', true)
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    console.error('Error fetching shared chat:', error)
    return null
  }
}

export async function shareChat(id: string, userId: string = 'anonymous') {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('chats')
      .update({
        is_shared: true,
        share_path: `/share/${id}`
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    console.error('Error sharing chat:', error)
    return null
  }
}

export async function createChat(
  chat: Omit<Chat, 'id' | 'created_at'>
): Promise<Chat | null> {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('chats')
      .insert({
        ...chat,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    console.error('Error creating chat:', error)
    return null
  }
}

export async function updateChatTitle(
  chatId: string,
  newTitle: string
): Promise<void> {
  const supabase = await createClient()
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
  const supabase = await createClient()
  const { error } = await supabase.from('chats').delete().in('id', chatIds)

  if (error) {
    console.error('Error bulk deleting chats:', error)
    throw error
  }
}
