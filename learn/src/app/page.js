'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'
import { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar } from 'react-icons/fi'

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState([])
  const [nextEvents, setNextEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        // Fetch events for current month view
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59)

        const { data: monthEvents, error: monthError } = await supabase
          .from('classes')
          .select('id, title, description, date')
          .gte('date', firstDay.toISOString())
          .lte('date', lastDay.toISOString())
          .order('date', { ascending: true })

        if (monthError) throw monthError

        // Fetch next 2 upcoming events from today
        const { data: upcomingEvents, error: upcomingError } = await supabase
          .from('classes')
          .select('id, title, date')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(2)

        if (upcomingError) throw upcomingError

        setEvents(monthEvents || [])
        setNextEvents(upcomingEvents || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentMonth])

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const weeks = []
    let day = 1

    for (let i = 0; i < 6; i++) {
      const week = []

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > daysInMonth) {
          week.push(<div key={j} className="h-24 border border-gray-200 bg-gray-50" />)
        } else {
          const thisDate = new Date(year, month, day)
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date)
            return (
              eventDate.getFullYear() === year &&
              eventDate.getMonth() === month &&
              eventDate.getDate() === day
            )
          })

          week.push(
            <div
            key={j}
              className="min-h-[5rem] sm:h-24 p-1 border border-gray-200 bg-white flex flex-col"
              >
              <div className="text-sm font-semibold text-gray-700">{day}</div>
              <div className="mt-1 space-y-1 overflow-y-auto text-xs max-h-[4rem] sm:max-h-full">
                {dayEvents.map((event, index) => (
                  <Link
                    key={event.id}
                    href={`/classes/${event.id}`}
                    className={`block px-2 py-1 rounded text-white truncate ${
                      ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'][index % 4]
                    } hover:brightness-110`}
                  >
                    {event.title}
                  </Link>
                ))}
              </div>
            </div>
          )
          day++
        }
      }

      weeks.push(
        <div key={i} className="grid grid-cols-7 gap-px bg-gray-200">{week}</div>
      )
    }

    return weeks
  }

  const formatEventDate = (isoString) => {
    const date = new Date(isoString);

  // Format in UTC so time doesn't shift
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
    })
  }

  if (error) {
    return (
      <main className="min-h-screen p-4">
        <p className="text-red-500">Error loading events: {error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Class Calendar</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 border text-sm flex items-center"
          >
            <FiChevronLeft className="mr-1" /> Prev
          </button>
          <span className="text-lg font-medium text-gray-700">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100 border text-sm flex items-center"
          >
            Next <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>

      {/* Next Events Section */}
      {!loading && nextEvents.length > 0 && (
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <h2 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
            <FiCalendar className="mr-2 text-blue-500" />
            Upcoming Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextEvents.map((event, index) => (
              <Link
                key={event.id}
                href={`/classes/${event.id}`}
                className={`p-4 rounded-lg border hover:shadow-md transition-all ${
                  index % 2 === 0 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <h3 className="font-medium text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatEventDate(event.date)}
                </p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                  index % 2 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }">
                  {index === 0 ? 'Next Class' : 'Following'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Section */}
      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-500">Loading calendar...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto sm:overflow-visible">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-7 text-xs font-medium text-center text-gray-600 bg-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 border border-gray-200">{day}</div>
              ))}
            </div>
            <div className="divide-y divide-gray-200">{renderCalendar()}</div>
          </div>
        </div>
      )}

   { /* <div className="mt-8 text-center">
        <Link 
          href="/admin/create-class" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
        >
          <FiPlus className="mr-2" />
          Create New Class
        </Link>
      </div> */} 
    </main>
  )
}
