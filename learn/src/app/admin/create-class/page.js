'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../app/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
export const runtime = "edge";

export default function CreateClass() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    join_link: '',
    forms_link: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(null) // Start with null to indicate loading

  useEffect(() => {
    // Check admin status after component mounts
    const adminSecret = searchParams.get('secret')
    setIsAdmin(adminSecret === process.env.NEXT_PUBLIC_ADMIN_SECRET)
  }, [searchParams])

  useEffect(() => {
    // Only redirect if we've determined the user is not admin
    if (isAdmin === false) {
      router.push('/classes')
    }
  }, [isAdmin, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('classes')
        .insert([formData])

      if (error) throw error
      router.push(`/classes?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
    } catch (err) {
      alert(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking admin status
  if (isAdmin === null) {
    return <div className="max-w-2xl mx-auto p-6">Loading...</div>
  }

  // Only render form if admin
  if (isAdmin) {
    return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Meeting Link</label>
          <input
            type="url"
            value={formData.join_link}
            onChange={(e) => setFormData({...formData, join_link: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="https://zoom.us/j/..."
            required
          />
        </div>
        <div>
          <label className="block mb-1">Microsoft Forms Link</label>
          <input
            type="url"
            value={formData.forms_link}
            onChange={(e) => setFormData({...formData, forms_link: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="https://forms.office.com/..."
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating...' : 'Create Class'}
        </button>
      </form>
    </div>
  )
}
  // Return null if not admin (though the redirect should happen first)
  return null
}