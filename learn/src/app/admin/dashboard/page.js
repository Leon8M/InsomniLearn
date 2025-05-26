import { supabase } from '../../lib/supabase'
import { redirect } from 'next/navigation'
export const runtime = "edge";

export default async function AdminDashboard({ searchParams }) {
  // Properly await searchParams access
  const { secret } = searchParams
  
  if (secret !== process.env.ADMIN_SECRET) {
    redirect('/classes')
  }

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select(`
      *,
      class:classes(title, date)
    `)
    .order('created_at', { ascending: false })

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .order('date', { ascending: true })

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4 mt-4">
          <a 
            href={`/classes?secret=${process.env.ADMIN_SECRET}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Classes
          </a>
          <a 
            href={`/admin/create-class?secret=${process.env.ADMIN_SECRET}`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Class
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent RSVPs</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rsvps?.map(rsvp => (
                  <tr key={rsvp.id} className="border-t">
                    <td className="px-4 py-2">{rsvp.class?.title}</td>
                    <td className="px-4 py-2">{rsvp.name}</td>
                    <td className="px-4 py-2 capitalize">{rsvp.attendance_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <div className="space-y-2">
            {classes?.map(classItem => (
              <div key={classItem.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium">{classItem.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(classItem.date).toLocaleString()}
                </p>
                <p className="text-sm mt-1">
                  <a 
                    href={classItem.join_link} 
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Join Link
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}