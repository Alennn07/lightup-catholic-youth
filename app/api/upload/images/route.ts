import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateFile, generateFileName, UPLOAD_CONFIGS, sanitizeFileName } from '@/lib/upload-utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Get user from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const context = formData.get('context') as string // 'prayer-wall', 'journal', etc.
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate the file
    const validation = validateFile(file, UPLOAD_CONFIGS.image)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Generate secure filename with context
    const sanitizedName = sanitizeFileName(file.name)
    const fileName = generateFileName(user.id, sanitizedName, 'image')
    const contextualFileName = context ? `${context}/${fileName}` : fileName

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(contextualFileName, fileBuffer, {
        contentType: file.type
      })

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload image',
        details: uploadError.message 
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(contextualFileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uploadData.path,
      context: context || 'general',
      message: 'Image uploaded successfully'
    })

  } catch (error: any) {
    console.error('Image upload API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Get user from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Parse the form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const context = formData.get('context') as string
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 files allowed' }, { status: 400 })
    }

    const uploadResults = []
    const errors = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Validate the file
        const validation = validateFile(file, UPLOAD_CONFIGS.image)
        if (!validation.isValid) {
          errors.push({ file: file.name, error: validation.error })
          continue
        }

        // Generate secure filename with context
        const sanitizedName = sanitizeFileName(file.name)
        const fileName = generateFileName(user.id, sanitizedName, 'image')
        const contextualFileName = context ? `${context}/${fileName}` : fileName

        // Convert file to buffer
        const fileBuffer = await file.arrayBuffer()

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(contextualFileName, fileBuffer, {
            contentType: file.type
          })

        if (uploadError) {
          errors.push({ file: file.name, error: uploadError.message })
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(contextualFileName)

        uploadResults.push({
          fileName: file.name,
          url: publicUrl,
          path: uploadData.path
        })

      } catch (error: any) {
        errors.push({ file: file.name, error: error.message })
      }
    }

    return NextResponse.json({
      success: uploadResults.length > 0,
      uploads: uploadResults,
      errors: errors,
      message: `${uploadResults.length} files uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`
    })

  } catch (error: any) {
    console.error('Multiple image upload API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
