'use client'

import { useState } from 'react'
import { updateUserRole } from './actions'
import { Shield, ShieldAlert, Loader2 } from 'lucide-react'

export function UserRoleSelect({ user }: { user: any }) {
  const [role, setRole] = useState(user.role)
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setLoading(true)
    const result = await updateUserRole(user.id, newRole)
    if (result.success) {
      setRole(newRole)
    } else {
      alert('Failed to update role. Are you an Admin?')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <select 
        value={role} 
        onChange={handleRoleChange} 
        disabled={loading}
        className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:border-primary/50 outline-none transition-all disabled:opacity-50"
      >
        <option value="Viewer">Viewer</option>
        <option value="Author">Author</option>
        <option value="Admin">Admin</option>
      </select>
      {loading && <Loader2 className="animate-spin text-primary" size={16} />}
      {!loading && role === 'Admin' && <Shield className="text-emerald-500" size={16} />}
      {!loading && role === 'Author' && <ShieldAlert className="text-primary" size={16} />}
    </div>
  )
}
