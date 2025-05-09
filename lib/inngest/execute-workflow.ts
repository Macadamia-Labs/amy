import { getUserProfile } from '@/lib/actions/users'
import { researcher } from '@/lib/agents/researcher'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { generateText } from 'ai'
import { inngest } from './client'

// Define the event payload type
interface ExecuteWorkflowPayload {
  workflowId: string
  userId: string
}

export const executeWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflow/execute.requested' },
  async ({ event }) => {
    const { workflowId, userId } = event.data as ExecuteWorkflowPayload

    console.log('[Inngest:execute-workflow] Received event', {
      workflowId,
      userId
    })

    const supabase = await createServiceRoleClient()

    try {
      // Fetch the complete workflow with its attached resources
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .select(
          `
          *,
          workflows_resources (
            resource_id,
            resources (
              id,
              title,
              description,
              content,
              content_as_text,
              file_type,
              created_at,
              updated_at
            )
          )
        `
        )
        .eq('id', workflowId)
        .single()

      if (workflowError || !workflowData) {
        console.error('[Inngest:execute-workflow] Workflow not found', {
          workflowId,
          error: workflowError
        })
        // Update status to failed if workflow not found
        await supabase
          .from('workflows')
          .update({ status: 'failed' })
          .eq('id', workflowId)
        throw new Error(`Workflow not found: ${workflowId}`)
      }

      console.log(
        '[Inngest:execute-workflow] Fetched workflow data',
        workflowData
      )

      // Transform the data to match the Workflow type
      const workflow = {
        ...workflowData,
        resourceIds:
          workflowData.workflows_resources?.map(
            (wr: { resource_id: string }) => wr.resource_id
          ) || [],
        resources:
          workflowData.workflows_resources?.map(
            (wr: { resources: any }) => wr.resources
          ) || []
      }

      console.log('[Inngest:execute-workflow] Fetched workflow', workflow)

      // Update workflow status to running
      const { error: updateRunningError } = await supabase
        .from('workflows')
        .update({ status: 'running' })
        .eq('id', workflowId)

      if (updateRunningError) {
        console.error(
          '[Inngest:execute-workflow] Error updating status to running',
          { workflowId, error: updateRunningError }
        )
        // Don't necessarily fail the whole execution here, but log it.
      }

      // Execute the workflow using the researcher
      const userProfile = await getUserProfile(userId)

      const researcherConfig = researcher({
        messages: [
          {
            role: 'user',
            content: 'Execute the workflow messages'
          }
        ],
        model: 'openai:gpt-4o', // Ensure this model is appropriate
        workflow,
        userProfile,
        resourcesContext: {
          resourceIds: workflow.resourceIds,
          resourcesContent: workflow.resources
            .map((r: any) => r.content_as_text)
            .join('\n')
        }
      })

      console.log(
        '[Inngest:execute-workflow] Researcher config messages',
        researcherConfig.messages
      )
      const { text } = await generateText(researcherConfig)

      console.log('[Inngest:execute-workflow] Result text', text)

      // Store execution results
      const { error: insertExecutionError } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: workflowId,
          result: text,
          status: 'completed'
        })

      if (insertExecutionError) {
        console.error(
          '[Inngest:execute-workflow] Error inserting execution record',
          { workflowId, error: insertExecutionError }
        )
        // Consider how to handle this - maybe retry?
      }

      // Update workflow status to completed
      const { error: updateCompletedError } = await supabase
        .from('workflows')
        .update({
          status: 'completed',
          last_run: new Date().toISOString()
        })
        .eq('id', workflowId)

      if (updateCompletedError) {
        console.error(
          '[Inngest:execute-workflow] Error updating status to completed',
          { workflowId, error: updateCompletedError }
        )
      }

      console.log(
        '[Inngest:execute-workflow] Execution completed successfully',
        { workflowId }
      )

      return {
        event,
        body: { message: 'Workflow executed successfully', result: text }
      }
    } catch (error) {
      console.error('[Inngest:execute-workflow] Error during execution', {
        workflowId,
        error
      })

      // Update workflow status to failed on any error during the core logic
      await supabase
        .from('workflows')
        .update({ status: 'failed' })
        .eq('id', workflowId)

      // Rethrow the error to let Inngest handle retries/failure
      throw error
    }
  }
)
