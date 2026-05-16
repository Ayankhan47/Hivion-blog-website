import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Clock, User as UserIcon, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author:users(name, email)')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, user:users(name)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-500 flex flex-col gap-8">
      
      <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors w-fit">
        <ArrowLeft size={16} />
        <span>Back to Posts</span>
      </Link>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight flex-1">{post.title}</h1>
          {user && (post.author_id === user.id || (await supabase.from('users').select('role').eq('id', user.id).single()).data?.role === 'Admin') && (
            <Link href={`/post/${post.id}/edit`} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-border">
              Edit Post
            </Link>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
          <div className="flex items-center gap-2">
            <UserIcon size={16} className="text-primary" />
            <span className="font-medium text-foreground/80">{post.author?.name || 'Unknown Author'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(post.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {post.image_url && (
        <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-border">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {post.summary && (
        <div className="glass p-6 rounded-xl border-l-4 border-l-primary relative">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 rounded-r-xl pointer-events-none"></div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span className="bg-primary text-white text-xs px-2 py-1 rounded">AI</span>
            Summary
          </h3>
          <p className="text-muted leading-relaxed relative z-10">{post.summary}</p>
        </div>
      )}

      <div className="prose prose-invert max-w-none prose-lg mt-4 text-foreground/90">
        {post.body.split('\n').map((paragraph: string, idx: number) => (
          <p key={idx} className="mb-4">{paragraph}</p>
        ))}
      </div>

      <hr className="border-border my-8" />

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Comments ({comments?.length || 0})</h2>
        
        {user ? (
          <form action="/api/comments/new" method="POST" className="flex flex-col gap-4 max-w-2xl">
            <input type="hidden" name="post_id" value={post.id} />
            <textarea 
              name="comment_text"
              required
              placeholder="Leave a comment..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted resize-y"
              rows={3}
            />
            <button type="submit" className="self-end bg-primary hover:bg-primary-hover text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="card-glass p-6 rounded-xl flex items-center justify-between">
            <p className="text-muted">You must be logged in to comment.</p>
            <Link href="/login" className="bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition">
              Log In
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-6 mt-8">
          {comments?.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{comment.user?.name || 'User'}</span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-foreground/90">{comment.comment_text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
