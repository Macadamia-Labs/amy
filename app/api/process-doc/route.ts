import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { docUrl, userId } = await request.json()

    if (!docUrl || !userId) {
      return NextResponse.json(
        { error: 'Document URL and userId are required' },
        { status: 400 }
      )
    }

    // Process the document
    const pages = await processDocument(docUrl)

    if (!pages || pages.length === 0) {
      return NextResponse.json(
        { error: 'Failed to process document' },
        { status: 500 }
      )
    }

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error processing document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
