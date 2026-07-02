import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const email = location.state?.email
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!email) {
    navigate('/login')
    return null
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { email, otp })
      const { access_token, is_new_user, user } = res.data

      if (is_new_user) {
        navigate('/register', { state: { email, access_token } })
      } else {
        login(access_token, user)
        navigate('/courses')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    setError('')
    try {
      await api.post('/auth/send-otp', { email })
      setError('A new OTP has been sent.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not resend OTP')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Verify OTP</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            required
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-md px-4 py-2.5 text-center tracking-[8px] text-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          />

          {error && <p className="text-sm text-gray-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={resendOtp}
            className="w-full text-sm text-brand-indigo hover:underline"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  )
}