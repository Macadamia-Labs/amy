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
  const description = (formData.get('description') as string) || ''
  const category = (formData.get('category') as string) || 'uncategorized'
  // Accept a client-provided resourceId
  const clientId = formData.get('id') as string | undefined

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const resourceId = clientId || generateUUID()
    const fileExt = file.name?.split('.').pop() || ''
    const fileName = `${user.id}/${resourceId}.${fileExt}`

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, file)

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
      description,
      category,
      file_path: fileName,
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: 'pending'
    }

    // Insert resource metadata in DB
    const { error: dbError } = await supabase
      .from('resources')
      .insert([resource])

    if (dbError) {
      // If DB insert fails, remove uploaded file
      await supabase.storage.from('resources').remove([fileName])
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Error saving resource metadata' },
        { status: 500 }
      )
    }

    // Get public URL from storage
    const { data } = await supabase.storage.from('resources').createSignedUrl(fileName, 60)
    
    if (!data) {
      throw new Error('Failed to create signed URL')
    }

    const { signedUrl } = data
    console.log('[UPLOAD] Public URL:', signedUrl)

    // Trigger background process
    await inngest.send({
      name: 'file.uploaded',
      data: {
        resourceId,
        fileUrl: signedUrl,
        userId: user.id,
        title,
        category
      }
    })

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        resource: {
          ...resource,
          file_path: signedUrl
        }
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
