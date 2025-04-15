import { getUserProfile } from '@/lib/actions/users'
import { researcher } from '@/lib/agents/researcher'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300 // 5 minutes timeout

export async function POST(request: NextRequest) {
  try {
    const { workflowId, userId } = await request.json()

    console.log('[execute-workflow] workflowId', workflowId)
    console.log('[execute-workflow] userId', userId)

    if (!workflowId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch the complete workflow with its attached resources
    const { data: workflowData, error: workflowError } = await supabase
      .from('workflows')
      .select(
        `
        *,
        workflows_resources!inner (
          resource_id,
          resources!inner (
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
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

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

    console.log('[execute-workflow] workflow', workflow)

    // Update workflow status to running
    await supabase
      .from('workflows')
      .update({ status: 'running' })
      .eq('id', workflowId)

    try {
      const userProfile = await getUserProfile(userId)

      // Execute the workflow using the researcher
      const researcherConfig = researcher({
        messages: [
          {
            role: 'user',
            content: 'Execute the workflow messages'
          }
        ],
        model: 'openai:gpt-4o',
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
        '[execute-workflow] researcherConfig messages',
        researcherConfig.messages
      )
      const { text } = await generateText(researcherConfig)

      console.log('[execute-workflow] result', text)

      // Store execution results
      await supabase.from('workflow_executions').insert({
        workflow_id: workflowId,
        result: text,
        status: 'completed'
      })

      // Update workflow status to completed
      await supabase
        .from('workflows')
        .update({
          status: 'completed',
          last_run: new Date().toISOString()
        })
        .eq('id', workflowId)

      return NextResponse.json({
        status: 'completed',
        message: 'Workflow executed successfully',
        result: text
      })
    } catch (error) {
      // Update workflow status to failed
      await supabase
        .from('workflows')
        .update({ status: 'failed' })
        .eq('id', workflowId)

      throw error
    }
  } catch (error) {
    console.error('Error executing workflow:', error)
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    )
  }
}
