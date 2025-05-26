'use client'
import { supabase } from '../../../app/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import RSVPForm from './RSVPForm'
export const runtime = "edge";

export default function ClassPage() {
  const params = useParams()
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('id', params.classId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Class not found')
        
        setClassData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.classId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold">{classData.title}</h1>
        <p className="mt-2 text-gray-600">
          {new Date(classData.date).toLocaleString()}
        </p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="mt-2">{classData.description}</p>
        </div>
        {classData.join_link && (
          <div className="mt-4">
            <a 
              href={classData.join_link} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>

      <RSVPForm classId={classData.id} />

      {classData.forms_link && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Comments or Suggestions?</h2>
          <a 
            href={classData.forms_link} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit via Microsoft Forms
          </a>
        </div>
      )}
    </div>
  )
}