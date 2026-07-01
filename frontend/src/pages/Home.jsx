import { Link } from 'react-router-dom'
import BannerCarousel from '../components/BannerCarousel'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <BannerCarousel />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Corporates Guide LMS</h1>
        <p className="text-gray-500">Your guide to mastering in-demand tech skills</p>
        <Link
          to="/courses"
          className="inline-block mt-5 px-6 py-2.5 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
        >
          Explore Courses
        </Link>
      </div>
    </div>
  )
}
