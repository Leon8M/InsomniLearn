import { supabase } from '../../lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, classId } = await request.json()
    
    console.log('Registration attempt:', { email, classId }) // Debug log

    // 1. Verify the class exists and get join link
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('join_link, title')
      .eq('id', classId)
      .single()

    if (classError || !classData) {
      console.error('Class lookup error:', classError)
      throw new Error(classError?.message || 'Class not found')
    }

    // 2. Insert registration
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        email,
        class_id: classId,
        join_link: classData.join_link,
        class_title: classData.title
      })
      .select() // Returns the inserted record

    if (error) {
      console.error('Registration error:', error)
      throw error
    }

    console.log('Registration successful:', data)

    return NextResponse.json({
      success: true,
      join_link: classData.join_link,
      class_title: classData.title
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}