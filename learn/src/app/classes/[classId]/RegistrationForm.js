'use client'
import { useState } from 'react'
export const runtime = "edge";

export default function RegistrationForm({ classId }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registrationResult, setRegistrationResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          classId
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setRegistrationResult(data)
    } catch (err) {
      console.error('Registration error:', err)
      alert(`Registration failed: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (registrationResult?.success) {
  return (
    <div className="bg-green-50 border border-green-400 text-green-700 px-6 py-4 rounded-2xl shadow-md">
      <p className="font-bold text-lg">✅ Registration successful!</p>
      <p className="mt-2">
        You are registered for <span className="font-semibold">{registrationResult.class_title}</span>.
      </p>
      <a 
        href={registrationResult.join_link} 
        className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        👉 Click here to join the class
      </a>
    </div>
  )

  }

  return (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Register for this class</h3>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg shadow-sm text-white text-sm font-semibold transition 
          ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Registering...' : 'Register Now'}
      </button>
    </form>
  </div>
)

}