import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the most recent execution for this workflow
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching workflow execution:', error)
      return NextResponse.json(
        { error: 'Failed to fetch workflow execution' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ result: null })
    }

    return NextResponse.json({ result: data.result })
  } catch (error) {
    console.error('Error in workflow executions route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
