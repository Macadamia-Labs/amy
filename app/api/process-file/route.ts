import { processFileFromUrl } from '@/lib/process-file'
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

    const result = await processFileFromUrl(fileUrl)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
