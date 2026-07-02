import { useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    dob: user?.dob || '',
    organization: user?.organization || '',
    organization_type: user?.organization_type || 'college',
    phone: user?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePictureChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const res = await api.put('/user/me', { profile_picture: reader.result })
        setUser(res.data)
      } catch (err) {
        setError('Could not update picture')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await api.put('/user/me', form)
      setUser(res.data)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save changes')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <label className="absolute bottom-0 right-0 bg-brand-indigo text-white text-xs px-2 py-1 rounded-full cursor-pointer">
              Edit
              <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        {!editing ? (
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-500">Date of Birth:</span> {user.dob}</p>
            <p><span className="text-gray-500">{user.organization_type === 'company' ? 'Company' : 'College'}:</span> {user.organization}</p>
            <p><span className="text-gray-500">Phone:</span> {user.phone || '-'}</p>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-5 py-2 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500">Email (cannot be changed)</label>
              <input value={user.email} disabled className="w-full border rounded-md px-4 py-2.5 bg-gray-100 text-gray-500" />
            </div>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
            <input name="dob" type="date" value={form.dob} onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
            <select name="organization_type" value={form.organization_type} onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo">
              <option value="college">College</option>
              <option value="company">Company</option>
            </select>
            <input name="organization" placeholder="Organization" value={form.organization} onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo" />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="px-5 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-10">
          <h2 className="font-bold text-gray-800 mb-3">Enrolled Courses</h2>
          {user.enrolled_courses?.length ? (
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {user.enrolled_courses.map((c) => (
                <li key={c}>{c.replace(/-/g, ' ')}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">You haven't enrolled in any course yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}