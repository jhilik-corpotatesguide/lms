import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SessionWarningModal from './components/SessionWarningModal'
import RequireAuth from './components/RequireAuth'
import { useSessionTimeout } from './hooks/useSessionTimeout'

import Home from './pages/Home'
import About from './pages/About'
import CalendarPage from './pages/Calendar'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'
import Register from './pages/Register'
import Courses from './pages/Courses'
import Profile from './pages/Profile'

export default function App() {
  const { showWarning, secondsLeft, continueSession } = useSessionTimeout()

  return (
    <>
      <Navbar />
      <SessionWarningModal visible={showWarning} secondsLeft={secondsLeft} onContinue={continueSession} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/courses"
          element={
            <RequireAuth>
              <Courses />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}
