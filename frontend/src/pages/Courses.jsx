import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrollingSlug, setEnrollingSlug] = useState(null)
  const { user, isLoggedIn, setUser } = useAuth()

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data)).finally(() => setLoading(false))
  }, [])

  const handleEnroll = async (slug) => {
    if (!isLoggedIn) return
    setEnrollingSlug(slug)
    try {
      const res = await api.post('/user/enroll', { course_slug: slug })
      setUser(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not enroll')
    } finally {
      setEnrollingSlug(null)
    }
  }

  const isEnrolled = (slug) => user?.enrolled_courses?.includes(slug)

  return (

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden flex flex-col">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Our Courses</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">Choose a course and start your learning journey today</p>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.slug} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="h-40 bg-brand-light flex items-center justify-center">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">📘</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1">{course.description}</p>
                <p className="text-xs text-gray-500 mb-1">⏱ {course.duration}</p>
                {course.certificate && <p className="text-xs text-gray-500 mb-1">🎓 Certificate Awarded by Corporate Guide</p>}
                {course.placement_support && <p className="text-xs text-gray-500 mb-3">💼 Placement Support Provided</p>}

                <button
                  onClick={() => handleEnroll(course.slug)}
                  disabled={isEnrolled(course.slug) || enrollingSlug === course.slug}
                  className="mt-2 w-full py-2 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {isEnrolled(course.slug)
                    ? 'Enrolled ✓'
                    : enrollingSlug === course.slug
                    ? 'Enrolling...'
                    : 'Enroll Now →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}