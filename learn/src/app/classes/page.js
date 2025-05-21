import { supabase } from '../lib/supabase'
import Link from 'next/link'

export const revalidate = 0

export default async function ClassesPage({ searchParams }) {
  // Properly destructure searchParams
  const { secret } = searchParams
  const isAdmin = secret === process.env.ADMIN_SECRET
  
  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error loading classes: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Classes</h1>
        {isAdmin && (
          <Link 
            href="/admin/create-class" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New Class
          </Link>
        )}
      </div>

      {isAdmin && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500">
          <p className="font-semibold">Admin Mode Active</p>
          <Link 
            href="/admin/dashboard" 
            className="text-blue-600 hover:underline"
          >
            Go to Dashboard →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {classes?.map(classItem => (
          <div key={classItem.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{classItem.title}</h2>
            <p className="text-gray-600">{new Date(classItem.date).toLocaleString()}</p>
            <Link 
              href={`/classes/${classItem.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Class
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}