import { createClient } from '@/lib/supabase/client'
import { App } from '@/lib/types/apps'
import {
  Chat,
  FileRecord,
  Project,
  Report,
  Simulation,
  Version
} from '@/lib/types/database'
import { LANGUAGE_MAP } from '@/lib/utils/language-maps'
import { Message } from 'ai'
import { toast } from 'sonner'

const supabase = createClient()

// File queries
export async function getFiles(): Promise<FileRecord[]> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to view files')
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
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching files:', error)
    return []
  }
}

export async function createFile(
  file: Omit<FileRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<FileRecord | null> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to create files')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('files')
      .insert({
        ...file,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data as FileRecord
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating file:', error)
    return null
  }
}

export async function updateFile(
  id: string,
  updates: Partial<FileRecord>
): Promise<FileRecord | null> {
  try {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as FileRecord
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error updating file:', error)
    return null
  }
}

export async function deleteFile(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('files').delete().eq('id', id)

    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error deleting file:', error)
  }
}

export async function uploadFile(file: File): Promise<FileRecord | null> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to upload files')
    return null
  }

  try {
    // Read file content for text files
    let content = ''
    if (file.type.startsWith('text/')) {
      content = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target?.result as string)
        reader.onerror = e => reject(e)
        reader.readAsText(file)
      })
    }

    // Upload file to storage in user-specific bucket
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        upsert: false,
        cacheControl: '3600'
      })

    if (uploadError) throw uploadError

    // Determine language from file extension
    const language = LANGUAGE_MAP[fileExt] || 'plaintext'

    // Create file record in database with file path, content, and language
    const fileRecord = {
      name: file.name,
      type: file.type.startsWith('text/') ? 'script' : 'data',
      file_path: filePath,
      content,
      language,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('files')
      .insert(fileRecord)
      .select()
      .single()

    if (error) throw error
    return data as FileRecord
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error uploading file:', error)
    return null
  }
}

// Project queries
export async function getProjects(app: string): Promise<Project[]> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to view projects')
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
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Project
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching project:', error)
    return null
  }
}

export async function createProject(
  project: Omit<Project, 'id' | 'created_at'>
): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data as Project
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating project:', error)
    return null
  }
}

export async function getVersions(projectId: string): Promise<Version[]> {
  try {
    const { data, error } = await supabase
      .from('versions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Version[]
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching versions:', error)
    return []
  }
}

export async function getVersion(id: string): Promise<Version | null> {
  try {
    const { data, error } = await supabase
      .from('versions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Version
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching version:', error)
    return null
  }
}

export async function createVersion(
  version: Omit<Version, 'id' | 'created_at'>
): Promise<Version | null> {
  try {
    const { data, error } = await supabase
      .from('versions')
      .insert(version)
      .select()
      .single()

    if (error) throw error
    return data as Version
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating version:', error)
    return null
  }
}

export async function getChats(): Promise<Chat[]> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to view chats')
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
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function fetchChat(id: string): Promise<Chat | null> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching chat:', error)
    return null
  }
}

export async function fetchChats(): Promise<Chat[]> {
  return getChats()
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
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating chat:', error)
    return null
  }
}

export async function updateChat(
  id: string,
  chat: Partial<Chat>
): Promise<Chat | null> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .update(chat)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Chat
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error updating chat:', error)
    return null
  }
}

export async function deleteChat(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('chats').delete().eq('id', id)

    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error deleting chat:', error)
  }
}

// Chat-files queries
export async function linkFileToChat({
  chatId,
  fileId
}: {
  chatId: string
  fileId: string
}): Promise<void> {
  console.log('LINKING FILE TO CHAT: ', chatId, fileId)
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to link files')
    return
  }

  try {
    const { data: existingChat } = await supabase
      .from('chats')
      .select()
      .eq('id', chatId)
      .single()

    if (!existingChat) {
      await supabase.from('chats').insert({
        id: chatId,
        user_id: user.id,
        title: 'New Chat'
      })
    }

    const { error } = await supabase.from('chat_files').insert({
      chat_id: chatId,
      file_id: fileId
    })

    if (error) throw error
    console.log('SUCCESSFULLY LINKED FILE TO CHAT: ', chatId, fileId)
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error linking file to chat:', error)
  }
}

export async function getChatFiles(chatId: string) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to view chat files')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('chat_files')
      .select(
        `
        chat_id,
        file_id,
        file:files(*)
      `
      )
      .eq('chat_id', chatId)

    if (error) throw error
    return data
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error getting chat files:', error)
    return []
  }
}

export async function unlinkFileFromChat({
  chatId,
  fileId
}: {
  chatId: string
  fileId: string
}): Promise<void> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to unlink files')
    return
  }

  try {
    const { error } = await supabase
      .from('chat_files')
      .delete()
      .eq('chat_id', chatId)
      .eq('file_id', fileId)

    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error unlinking file from chat:', error)
  }
}

export async function getRecentChats(app: App, limit: number): Promise<Chat[]> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to view chats')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .eq('app', app.toLowerCase())
      .order('last_message_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Chat[]
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching recent chats:', error)
    return []
  }
}

// Report queries
export async function getReports(): Promise<Report[]> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to view reports')
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
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching reports:', error)
    return []
  }
}

export async function createReport(input: {
  name: string
  instructions?: string
  input_files: string[]
}): Promise<Report | null> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    toast.error('You must be logged in to create reports')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        name: input.name,
        instructions: input.instructions,
        input_files: input.input_files,
        user_id: user.id,
        status: 'processing'
      })
      .select()
      .single()

    if (error) throw error
    return data as Report
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating report:', error)
    return null
  }
}

export async function updateReport(
  id: string,
  updates: Partial<Report>
): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Report
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error updating report:', error)
    return null
  }
}

export async function deleteReport(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error deleting report:', error)
  }
}

// Simulation queries
export async function getSimulations(projectId: string): Promise<Simulation[]> {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .select(
        `
        *,
        messages (*)
      `
      )
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Simulation[]
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error fetching simulations:', error)
    return []
  }
}

export async function createSimulation(
  simulation: Omit<Simulation, 'id' | 'created_at' | 'updated_at'>
): Promise<Simulation | null> {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .insert(simulation)
      .select()
      .single()

    if (error) throw error
    return data as Simulation
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating simulation:', error)
    return null
  }
}

export async function updateSimulation(
  id: string,
  updates: Partial<Simulation>
): Promise<Simulation | null> {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Simulation
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error updating simulation:', error)
    return null
  }
}

// Message queries
export async function createMessage(
  message: Omit<Message, 'id' | 'created_at'>
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()

    if (error) throw error
    return data as Message
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Error creating message:', error)
    return null
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
