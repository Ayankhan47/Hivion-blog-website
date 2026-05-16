'use client'

import { useFormStatus } from 'react-dom'
import { Sparkles, Loader2 } from 'lucide-react'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="mt-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-lg font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Publishing & Generating Summary...</span>
        </>
      ) : (
        <>
          <Sparkles size={20} />
          <span>Publish Post</span>
        </>
      )}
    </button>
  )
}
