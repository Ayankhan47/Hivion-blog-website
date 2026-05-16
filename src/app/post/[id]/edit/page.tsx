import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { SubmitButton } from '../../new/SubmitButton'
import { updatePost } from './actions'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  
  if (!userData || (userData.role !== 'Admin' && post.author_id !== user.id)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="card-glass p-10 rounded-2xl text-center max-w-md w-full border border-red-500/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-muted">You can only edit your own posts, unless you are an Admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-8">Edit <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Post</span></h1>
      
      <form action={updatePost} className="card-glass p-8 rounded-2xl flex flex-col gap-6">
        <input type="hidden" name="id" value={post.id} />
        
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground/80">Title</label>
          <input 
            type="text" 
            name="title" 
            id="title"
            required 
            defaultValue={post.title}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="body" className="text-sm font-medium text-foreground/80">Content</label>
          <textarea 
            name="body" 
            id="body"
            required 
            rows={12}
            defaultValue={post.body}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-y text-foreground"
          ></textarea>
          <p className="text-xs text-muted">Note: Updating the content will regenerate the AI summary.</p>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
