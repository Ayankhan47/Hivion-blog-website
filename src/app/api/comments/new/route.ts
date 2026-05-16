import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const formData = await request.formData()
  const post_id = formData.get('post_id') as string
  const comment_text = formData.get('comment_text') as string

  if (!post_id || !comment_text) {
    return redirect(`/post/${post_id}?error=MissingFields`)
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect(`/login`)
  }

  const { error } = await supabase.from('comments').insert({
    post_id,
    user_id: user.id,
    comment_text
  })

  if (error) {
    console.error('Error adding comment:', error)
  }

  return redirect(`/post/${post_id}`)
}
