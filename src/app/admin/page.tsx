import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { UserRoleSelect } from './UserRoleSelect'
import { ShieldCheck } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Validate Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: adminData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!adminData || adminData.role !== 'Admin') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="card-glass p-10 rounded-2xl text-center max-w-md w-full border border-red-500/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-muted">You need to be an Admin to view this page.</p>
        </div>
      </div>
    )
  }

  // Fetch all users
  const { data: users, error } = await supabase.from('users').select('*').order('name')

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="text-emerald-500" size={32} />
        <h1 className="text-4xl font-bold">Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Dashboard</span></h1>
      </div>
      
      <div className="card-glass rounded-2xl overflow-hidden border border-border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-border/50">
              <th className="px-6 py-4 font-semibold text-foreground/80">Name</th>
              <th className="px-6 py-4 font-semibold text-foreground/80">Email</th>
              <th className="px-6 py-4 font-semibold text-foreground/80">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-border/20 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{u.name || 'N/A'}</td>
                <td className="px-6 py-4 text-muted">{u.email}</td>
                <td className="px-6 py-4">
                  <UserRoleSelect user={u} />
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
