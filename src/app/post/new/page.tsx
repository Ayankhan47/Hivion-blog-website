import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createPost } from '../actions'
import { SubmitButton } from './SubmitButton'

export default async function NewPostPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  
  if (!userData || (userData.role !== 'Author' && userData.role !== 'Admin')) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="card-glass p-10 rounded-2xl text-center max-w-md w-full border border-red-500/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-muted">You need to be an Author or Admin to create posts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-8">Create New <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Post</span></h1>
      
      <form action={createPost} className="card-glass p-8 rounded-2xl flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground/80">Title</label>
          <input 
            type="text" 
            name="title" 
            id="title"
            required 
            placeholder="An exciting blog post title..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-sm font-medium text-foreground/80">Featured Image (Optional)</label>
          <input 
            type="file" 
            name="image" 
            id="image"
            accept="image/*"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border focus:border-primary/50 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer text-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="body" className="text-sm font-medium text-foreground/80">Content</label>
          <textarea 
            name="body" 
            id="body"
            required 
            rows={12}
            placeholder="Write your amazing post here..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted resize-y text-foreground"
          ></textarea>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
