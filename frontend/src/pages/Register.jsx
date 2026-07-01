import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const email = location.state?.email
  const [form, setForm] = useState({
    name: '',
    dob: '',
    organization: '',
    organization_type: 'college',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!email) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { email, ...form })
      const { access_token, user } = res.data
      login(access_token, user)
      navigate('/courses')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Complete Your Profile</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Registering as <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name" required placeholder="Full Name"
            value={form.name} onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          />
          <input
            name="dob" type="date" required
            value={form.dob} onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          />

          <select
            name="organization_type" value={form.organization_type} onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="college">College</option>
            <option value="company">Company</option>
          </select>

          <input
            name="organization" required
            placeholder={form.organization_type === 'college' ? 'College Name' : 'Company Name'}
            value={form.organization} onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          />

          <input
            name="phone" placeholder="Phone Number (optional)"
            value={form.phone} onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}
