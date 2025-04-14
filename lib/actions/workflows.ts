'use server'

import { createClient } from '@/lib/supabase/server'
import { authorizeUser } from '../supabase/authorize-user'
import { Workflow } from '../types/workflow'

export async function createWorkflow(
  title: string,
  description: string,
  instructions: string,
  userId: string,
  resourceIds?: string[]
) {
  const supabase = await createClient()

  // Start a transaction
  const { data: workflow, error: workflowError } = await supabase
    .from('workflows')
    .insert({ title, description, instructions, user_id: userId })
    .select()
    .single()

  if (workflowError) throw workflowError

  // If resourceIds are provided, attach them
  if (resourceIds && resourceIds.length > 0) {
    const { error: attachError } = await supabase
      .from('workflows_resources')
      .insert(
        resourceIds.map(resourceId => ({
          workflow_id: workflow.id,
          resource_id: resourceId
        }))
      )

    if (attachError) throw attachError
  }

  return workflow
}

export async function attachResourceToWorkflow(
  workflowId: string,
  resourceId: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('workflows_resources')
    .insert({ workflow_id: workflowId, resource_id: resourceId })

  if (error) throw error
}

export async function detachResourceFromWorkflow(
  workflowId: string,
  resourceId: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('workflows_resources')
    .delete()
    .eq('workflow_id', workflowId)
    .eq('resource_id', resourceId)

  if (error) throw error
}

export async function updateWorkflow(id: string, updates: Partial<Workflow>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('workflows')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function fetchWorkflow(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflows')
    .select(
      `
      *,
      workflows_resources (
        resource_id
      )
    `
    )
    .eq('id', id)
    .maybeSingle()

  if (error) throw error

  // Transform the data to include resourceIds
  return data
    ? {
        ...data,
        resourceIds:
          data.workflows_resources?.map((wr: any) => wr.resource_id) || []
      }
    : null
}

export async function fetchWorkflows() {
  const supabase = await createClient()
  const { user } = await authorizeUser()
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', user?.id)
  if (error) throw error
  return data
}

export async function deleteWorkflow(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('workflows').delete().eq('id', id)

  if (error) throw error
}
