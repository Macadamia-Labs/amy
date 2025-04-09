import { getResource, updateResource } from '@/lib/actions/resources'
import { inngest } from '@/lib/inngest/client'
import { authorizeUser } from '@/lib/supabase/authorize-user'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { resourceId } = await request.json()
    console.log('reprocessing resource', resourceId)

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const { user } = await authorizeUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the resource to reprocess
    const resource = await getResource(resourceId)

    await updateResource(resourceId, {
      status: 'processing',
      category: 'uncategorized'
    })

    // Trigger inngest event for reprocessing
    await inngest.send({
      name: 'file.uploaded',
      data: {
        resource,
        userId: user.id
      }
    })

    return NextResponse.json(
      { message: 'Resource reprocessing started' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error reprocessing resource:', error)
    return NextResponse.json(
      { error: 'Failed to reprocess resource' },
      { status: 500 }
    )
  }
}
