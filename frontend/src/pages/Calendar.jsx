export default function CalendarPage() {
  const today = new Date()
  const events = [
    { date: 'Every Monday', title: 'New batch starts' },
    { date: 'Every Friday', title: 'Live doubt-clearing session' },
    { date: 'End of month', title: 'Project submission deadline' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h1>
      <p className="text-gray-500 mb-8">Today is {today.toDateString()}</p>

      <div className="space-y-4">
        {events.map((e, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 flex justify-between shadow-sm">
            <span className="font-medium text-gray-700">{e.title}</span>
            <span className="text-brand-indigo font-semibold">{e.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
