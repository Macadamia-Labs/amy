import { getUserProfile } from '@/lib/actions/users'
import { researcher } from '@/lib/agents/researcher'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { workflow, userId } = await request.json()

    if (!workflow || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[execute-workflow] workflow', workflow)

    const workflowId = workflow.id

    const supabase = await createClient()

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
        workflowContext: {
          title: workflow.title,
          description: workflow.description,
          instructions: workflow.instructions,
          resources: workflow.resources
        },
        userProfile
      })

      console.log(
        '[execute-workflow] researcherConfig messages',
        researcherConfig.messages
      )
      const result = await generateText(researcherConfig)

      // Store execution results
      await supabase.from('workflow_executions').insert({
        workflow_id: workflowId,
        result: result,
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
        result
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
