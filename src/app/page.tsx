import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Search, Sparkles, Clock, User as UserIcon } from 'lucide-react'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const { query, page } = await searchParams;
  const supabase = await createClient()

  let q = supabase
    .from('posts')
    .select('*, author:users(name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (query) {
    q = q.ilike('title', `%${query}%`)
  }

  const limit = 9
  const currentPage = Number(page) || 1
  const from = (currentPage - 1) * limit
  const to = from + limit - 1

  q = q.range(from, to)

  const { data: posts, count, error } = await q

  if (error) {
    return <div className="text-red-400 text-center py-20">Error loading posts. Please make sure the database is set up.</div>
  }

  const totalPages = count ? Math.ceil(count / limit) : 1

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Discover <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Insights</span>
          </h1>
          <p className="text-muted text-lg max-w-xl">
            Explore our latest articles, automatically summarized by Google AI.
          </p>
        </div>
        
        <form className="w-full md:w-auto relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            name="query" 
            defaultValue={query} 
            placeholder="Search articles..." 
            className="w-full md:w-80 pl-10 pr-4 py-3 rounded-full bg-white/5 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted"
          />
        </form>
      </div>

      {/* Posts Grid */}
      {posts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <div className="p-4 rounded-full bg-white/5 mb-4">
            <Search size={32} className="opacity-50" />
          </div>
          <p className="text-xl">No posts found.</p>
          {query && <p className="text-sm mt-2">Try adjusting your search query.</p>}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <div key={post.id} className="card-glass rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
              {post.image_url ? (
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] to-transparent opacity-60"></div>
                </div>
              ) : (
                <div className="w-full h-52 bg-white/5 flex items-center justify-center relative overflow-hidden">
                  <Sparkles size={32} className="text-muted/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] to-transparent opacity-60"></div>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1 relative z-10 -mt-6">
                <div className="bg-primary/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3 border border-primary/20 backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles size={12} /> AI Summarized
                </div>
                
                <h2 className="text-xl font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/post/${post.id}`} className="after:absolute after:inset-0">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-sm text-muted mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {post.summary || 'No summary available.'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted/80 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <UserIcon size={14} />
                    <span className="truncate max-w-[100px]">{post.author?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <Link 
                key={p} 
                href={`/?page=${p}${query ? `&query=${query}` : ''}`}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                  p === currentPage 
                  ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                  : 'border-border text-muted hover:bg-white/5 hover:text-foreground'
                }`}
              >
                {p}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
