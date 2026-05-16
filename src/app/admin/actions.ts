'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient()

  // Validate current user is Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: adminData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!adminData || adminData.role !== 'Admin') {
    return { error: 'Not authorized' }
  }

  // Update user role
  const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId)
  
  if (error) {
    return { error: 'Failed to update role' }
  }

  revalidatePath('/admin')
  return { success: true }
}
