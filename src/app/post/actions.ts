'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GoogleGenAI } from '@google/genai'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!userData || (userData.role !== 'Author' && userData.role !== 'Admin')) {
    throw new Error('Not authorized to create posts')
  }

  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const image = formData.get('image') as File | null

  if (!title || !body) {
    throw new Error('Title and body are required')
  }

  let image_url = null
  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('featured-images')
      .upload(fileName, image)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw new Error('Failed to upload image')
    }

    const { data: { publicUrl } } = supabase.storage.from('featured-images').getPublicUrl(fileName)
    image_url = publicUrl
  }

  let summary = ''
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Summarize the following blog post in roughly 200 words:\n\n${body}`,
      });
      summary = response.text || ''
    } else {
      summary = 'AI summary could not be generated: API key missing.'
    }
  } catch (err) {
    console.error('Error generating summary:', err)
    summary = 'AI summary could not be generated at this time.'
  }

  const { error: insertError } = await supabase.from('posts').insert({
    title,
    body,
    image_url,
    summary,
    author_id: user.id
  })

  if (insertError) {
    console.error('Error inserting post:', insertError)
    throw new Error('Failed to create post')
  }

  revalidatePath('/')
  redirect('/')
}
