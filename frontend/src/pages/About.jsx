import { Link } from 'react-router-dom'

const STATS = [
  { value: '5+', label: 'Courses Offered' },
  { value: '1000+', label: 'Students Trained' },
  { value: '100%', label: 'Placement Support' },
  { value: '2-3', label: 'Months per Course' },
]

const OFFERINGS = [
  {
    icon: '💻',
    title: 'Hands-on Training',
    desc: 'Learn by building real projects, not just watching videos — every course is practical and project-based.',
  },
  {
    icon: '🎓',
    title: 'Recognized Certificate',
    desc: 'Get a certificate from Corporates Guide after successful completion, to showcase your skills.',
  },
  {
    icon: '💼',
    title: 'Placement Support',
    desc: 'We help connect trained students with hiring partners and guide you through interview preparation.',
  },
  {
    icon: '👩‍🏫',
    title: 'Expert Mentors',
    desc: 'Learn from industry professionals with real-world experience in their respective domains.',
  },
  {
    icon: '🛠️',
    title: 'Industry-Relevant Curriculum',
    desc: 'Courses are updated regularly to match current industry tools, frameworks, and best practices.',
  },
  {
    icon: '🤝',
    title: 'Internship Opportunities',
    desc: 'Get exposure to real work environments through internships arranged with our partner companies.',
  },
]

export default function About() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-indigo text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 dark-keep-color">
            About Corporates Guide
          </h1>
          <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl mx-auto dark-keep-color">
            Corporates Guide is a professional IT training institute dedicated to helping
            students and working professionals build future-ready skills through practical
            training, workshops, internships, and industry exposure.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 mb-14">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center py-6 px-2">
              <p className="text-2xl sm:text-3xl font-bold text-brand-purple dark-keep-color">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark-keep-color mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-600 dark-keep-color leading-relaxed">
          To bridge the gap between academic learning and industry requirements by
          equipping every learner with practical, in-demand technical skills — and
          the confidence to apply them in real jobs.
        </p>
      </div>

      {/* What we offer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERINGS.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 dark-keep-color mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark-keep-color leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-light dark:bg-gray-800/60 py-14 mb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to start learning?</h2>
          <p className="text-gray-600 dark-keep-color mb-6">
            Explore our courses and take the first step towards your dream career.
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
          >
            Explore Courses →
          </Link>
        </div>
      </div>
    </div>
  )
}