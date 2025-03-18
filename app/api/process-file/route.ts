import { processResource } from '@/lib/processing/process-resource'
import { authorizeUser } from '@/lib/supabase/authorize-user'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { fileUrl } = await request.json()

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      )
    }

    const { user } = await authorizeUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await processResource(fileUrl, user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      {
        error: (error as Error).message || 'Failed to process file',
        status: 'error',
        processing_error:
          (error as Error).message ||
          'An unexpected error occurred while processing the file. Please try again.'
      },
      { status: 500 }
    )
  }
}
