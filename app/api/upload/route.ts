import { authorizeUser } from '@/lib/supabase/authorize-user'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/upload/resource-handler'
import { processZipFile } from '@/lib/upload/zip-handler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Uploading file...')
  // Authorize user
  const { user, response } = await authorizeUser()
  if (response) {
    return response
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const clientId = formData.get('id') as string | undefined
  const isZip = formData.get('isZip') === 'true'

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Handle zip files differently
    if (isZip) {
      const resources = await processZipFile(file, user.id, supabase)
      return NextResponse.json(
        {
          message: 'Zip file was processed successfully.',
          resources
        },
        { status: 200 }
      )
    }

    // Regular file upload handling
    const resource = await uploadFile(file, user.id, clientId, supabase)

    return NextResponse.json(
      {
        message:
          'File was uploaded successfully, and is being processed in the background.',
        resource
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: 'Error processing upload' },
      { status: 500 }
    )
  }
}
