'use server'

import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

export async function createProject(data: {
  name: string
  description: string
}): Promise<{ project?: Project; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    // Insert the new project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name: data.name,
        description: data.description,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    // Revalidate the projects page
    revalidatePath('/(app)/projects')
    revalidatePath('/(app)')

    return { project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getProjects(): Promise<{
  projects?: Project[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    // Fetch projects for the user
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }

    return { projects: projects || [] }
  } catch (error) {
    return { error: 'An unexpected error occurred while fetching projects' }
  }
}

export async function deleteProject(
  projectId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    // Delete the project only if the user owns it
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting project:', error)
      // Check for specific errors if needed, e.g., foreign key constraints
      if (error.code === '23503') { // Foreign key violation
        return { error: 'Cannot delete project. It might have associated resources.' }
      }
      return { error: 'Failed to delete project.' }
    }

    // Revalidate relevant paths
    revalidatePath('/(app)/projects')
    revalidatePath('/(app)') // Revalidate the layout potentially showing the project list
    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting project:', error)
    return { error: 'An unexpected error occurred while deleting the project.' }
  }
}

export async function updateProject(
  projectId: string,
  data: { name?: string; description?: string }
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    // Only update non-null fields
    const updateData: { name?: string; description?: string } = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description

    // Update the project only if the user owns it
    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating project:', error)
      return { error: 'Failed to update project.' }
    }

    // Revalidate relevant paths
    revalidatePath('/(app)/projects')
    revalidatePath('/(app)')
    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error updating project:', error)
    return { error: 'An unexpected error occurred while updating the project.' }
  }
}

export async function getProject(
  projectId: string
): Promise<{ project?: Project; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    // Fetch the project by ID and ensure it belongs to the user
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { error: 'Project not found' }
      }
      return { error: error.message }
    }

    return { project }
  } catch (error) {
    return { error: 'An unexpected error occurred while fetching the project' }
  }
} 