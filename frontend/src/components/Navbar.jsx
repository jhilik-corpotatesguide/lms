import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/" className="text-xl font-bold text-brand-purple">
        Corporates Guide
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-brand-indigo">Home</Link>
        <Link to="/courses" className="hover:text-brand-indigo">Courses</Link>
        <Link to="/about" className="hover:text-brand-indigo">About</Link>
        <Link to="/calendar" className="hover:text-brand-indigo">Calendar</Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={user?.profile_picture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + (user?.name || user?.email)}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="hidden sm:inline">{user?.name || user?.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-1.5 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  )
}
