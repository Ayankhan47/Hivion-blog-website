'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GoogleGenAI } from '@google/genai'

export async function updatePost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  if (!id || !title || !body) {
    throw new Error('Missing required fields')
  }

  const { data: post } = await supabase.from('posts').select('author_id, body').eq('id', id).single()
  if (!post) throw new Error('Post not found')

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!userData || (userData.role !== 'Admin' && post.author_id !== user.id)) {
    throw new Error('Not authorized to edit this post')
  }

  let summary = undefined
  // Generate new AI Summary if body changed
  if (post.body !== body) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following blog post in roughly 200 words:\n\n${body}`,
        });
        summary = response.text || ''
      }
    } catch (err) {
      console.error('Error generating summary:', err)
    }
  }

  const updateData: any = { title, body }
  if (summary !== undefined) {
    updateData.summary = summary
  }

  const { error: updateError } = await supabase.from('posts').update(updateData).eq('id', id)

  if (updateError) {
    console.error('Error updating post:', updateError)
    throw new Error('Failed to update post')
  }

  revalidatePath(`/post/${id}`)
  revalidatePath('/')
  redirect(`/post/${id}`)
}
