import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const closeMenu = () => setMenuOpen(false)

  // Square-box hover/active effect for desktop links
  const desktopLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-brand-purple text-white'
        : 'text-gray-700 hover:bg-brand-light hover:text-brand-purple'
    }`

  // Same effect for mobile dropdown links
  const mobileLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-brand-purple text-white'
        : 'text-gray-700 hover:bg-brand-light hover:text-brand-purple'
    }`

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
{/* Logo */}
<Link
  to="/"
  onClick={closeMenu}
  className="flex items-center"
>
  <img
    src="/logo.jpg"
    alt="Corporates Guide Logo"
    className="h-10 w-auto sm:h-20 object-contain"
  />
</Link>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium">
          <NavLink to="/" end className={desktopLinkClass}>Home</NavLink>
          <NavLink to="/courses" className={desktopLinkClass}>Courses</NavLink>
          <NavLink to="/about" className={desktopLinkClass}>About</NavLink>
          <NavLink to="/calendar" className={desktopLinkClass}>Calendar</NavLink>

          {isLoggedIn ? (
            <div className="flex items-center gap-3 ml-2">
              <NavLink to="/profile" className={desktopLinkClass}>
                <div className="flex items-center gap-2">
                  <img
                    src={user?.profile_picture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + (user?.name || user?.email)}
                    alt="current user profile avatar showing user initials or photo"
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <span className="hidden lg:inline">{user?.name || user?.email}</span>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 border-t bg-white space-y-1">
          <NavLink to="/" end onClick={closeMenu} className={mobileLinkClass}>Home</NavLink>
          <NavLink to="/courses" onClick={closeMenu} className={mobileLinkClass}>Courses</NavLink>
          <NavLink to="/about" onClick={closeMenu} className={mobileLinkClass}>About</NavLink>
          <NavLink to="/calendar" onClick={closeMenu} className={mobileLinkClass}>Calendar</NavLink>

          {isLoggedIn ? (
            <div className="mt-2 flex flex-col gap-2">
              <NavLink to="/profile" onClick={closeMenu} className={mobileLinkClass}>
                <div className="flex items-center gap-2">
                  <img
                    src={user?.profile_picture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + (user?.name || user?.email)}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span>{user?.name || user?.email}</span>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { closeMenu(); navigate('/login') }}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  )
}