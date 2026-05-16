import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/(auth)/actions'
import { PenSquare, LogOut, User as UserIcon, Zap } from 'lucide-react'

export default async function Navbar() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRole = null;
  if (user) {
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (data) {
      userRole = data.role;
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass transition-all duration-300">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-16 px-6">
        <div className="flex gap-2 items-center font-bold">
          <Zap className="text-primary fill-primary opacity-80" size={24} />
          <Link href={"/"} className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400 hover:opacity-80 transition-opacity tracking-tight">
            NextBlog.
          </Link>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          {user ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2 text-muted px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <UserIcon size={14} className="text-primary" />
                <span className="text-foreground/90">{userRole}</span>
              </div>
              {(userRole === 'Author' || userRole === 'Admin') && (
                <Link href="/post/new" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-0.5">
                  <PenSquare size={16} />
                  <span className="hidden sm:inline">Write Post</span>
                </Link>
              )}
              {userRole === 'Admin' && (
                <Link href="/admin" className="hidden sm:flex items-center gap-2 text-foreground/80 hover:text-white transition-colors py-2">
                  <span>Admin</span>
                </Link>
              )}
              <form action={signout}>
                <button className="flex items-center gap-2 text-muted hover:text-red-400 transition-colors py-2">
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link
                href="/login"
                className="text-muted hover:text-foreground transition-colors py-2 px-3"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-foreground text-background hover:bg-white/90 py-2 px-5 rounded-full transition-all transform hover:-translate-y-0.5 font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
