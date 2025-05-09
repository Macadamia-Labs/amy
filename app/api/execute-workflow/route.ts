import { inngest } from '@/lib/inngest/client'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300 // 5 minutes timeout

export async function POST(request: NextRequest) {
  try {
    console.log('[execute-workflow] request received')
    const { workflowId, userId } = await request.json()

    console.log('[execute-workflow] workflowId', workflowId)
    console.log('[execute-workflow] userId', userId)

    if (!workflowId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send an event to Inngest to handle the execution
    await inngest.send({
      name: 'workflow/execute.requested',
      data: {
        workflowId,
        userId
      }
    })

    // Return a success response immediately
    return NextResponse.json({
      message: 'Workflow execution initiated'
    })
  } catch (error) {
    console.error('Error initiating workflow execution:', error)
    return NextResponse.json(
      { error: 'Failed to initiate workflow execution' },
      { status: 500 }
    )
  }
}
