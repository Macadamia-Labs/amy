import { inngest } from '@/lib/inngest/client'
import { authorizeUser } from '@/lib/supabase/authorize-user'
import { createClient } from '@/lib/supabase/server'
import { generateUUID } from '@/lib/utils/helpers'
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
  const title = (formData.get('title') as string) || file?.name || 'Untitled'
  const clientId = formData.get('id') as string | undefined

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const resourceId = clientId || generateUUID()
    const fileExt = file.name?.split('.').pop() || ''
    const filePath = `${user.id}/${resourceId}.${fileExt}`

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Supabase storage error:', uploadError)
      return NextResponse.json(
        { error: 'Error uploading file to storage' },
        { status: 500 }
      )
    }

    // Create resource record
    const resource = {
      id: resourceId,
      title,
      file_path: filePath,
      file_type: fileExt,
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: 'pending',
      origin: 'upload'
    }

    // Insert resource metadata in DB
    const { error: dbError } = await supabase
      .from('resources')
      .insert(resource)
      .select()

    if (dbError) {
      // If DB insert fails, remove uploaded file
      await supabase.storage.from('resources').remove([filePath])
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Error saving resource metadata' },
        { status: 500 }
      )
    }

    // Trigger inngest event, so that the file is processed in the background
    await inngest.send({
      name: 'file.uploaded',
      data: {
        resource,
        userId: user.id
      }
    })

    // Return the resource
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
