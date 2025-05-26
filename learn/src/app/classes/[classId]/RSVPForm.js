'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export const runtime = "edge";

export default function RSVPForm({ classId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance_status: 'attending'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([{ ...formData, class_id: classId }]);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p>Thank you for your RSVP!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">RSVP for this class</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Will you attend?</label>
          <select
            value={formData.attendance_status}
            onChange={(e) => setFormData({...formData, attendance_status: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="attending">Yes, I'll be there</option>
            <option value="maybe">Maybe</option>
            <option value="not_attending">No, I can't attend</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
}