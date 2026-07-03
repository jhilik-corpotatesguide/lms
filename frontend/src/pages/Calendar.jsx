import { useState } from 'react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Sample events: key = "YYYY-M-D", value = event title
const EVENTS = {
  // Example: every Monday & Friday recurring events are handled separately below
}

export default function CalendarPage() {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  // Recurring events: every Monday = "New batch starts", every Friday = "Doubt session"
  const getEventForDay = (dateObj) => {
    const day = dateObj.getDay()
    if (day === 1) return { label: 'New batch starts', color: 'bg-brand-purple' }
    if (day === 5) return { label: 'Doubt-clearing session', color: 'bg-emerald-500' }
    return null
  }

  // Build the full 6-week grid (42 cells) including leading/trailing days
  const cells = []

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      inCurrentMonth: false,
    })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(year, month, d),
      inCurrentMonth: true,
    })
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const lastDate = cells[cells.length - 1].date
    const next = new Date(lastDate)
    next.setDate(next.getDate() + 1)
    cells.push({ date: next, inCurrentMonth: false })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Calendar</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={goPrevMonth}
            className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Previous month"
          >
            ‹
          </button>

          <span className="min-w-[140px] text-center font-semibold">
            {MONTH_NAMES[month]} {year}
          </span>

          <button
            onClick={goNextMonth}
            className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Next month"
          >
            ›
          </button>

          <button
            onClick={goToday}
            className="ml-2 px-3 py-2 rounded-lg text-sm bg-brand-purple text-white hover:opacity-90"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b dark:border-gray-700">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-500 dark-keep-color"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {cells.map(({ date, inCurrentMonth }, i) => {
            const isToday = isSameDate(date, today)
            const event = getEventForDay(date)

            return (
              <div
                key={i}
                className={`min-h-[70px] sm:min-h-[90px] p-1.5 sm:p-2 border-b border-r dark:border-gray-700 last:border-r-0
                  ${!inCurrentMonth ? 'bg-gray-50 dark:bg-gray-900/40' : ''}
                `}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm
                    ${isToday ? 'bg-brand-purple text-white font-bold' : ''}
                    ${!inCurrentMonth ? 'text-gray-400 dark-keep-color' : ''}
                  `}
                >
                  {date.getDate()}
                </div>

                {event && inCurrentMonth && (
                  <div className={`mt-1 text-[10px] sm:text-xs text-white ${event.color} rounded px-1 py-0.5 truncate`}>
                    {event.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-5 text-xs sm:text-sm text-gray-500 dark-keep-color">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-brand-purple inline-block" /> New batch (every Monday)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Doubt-clearing session (every Friday)
        </div>
      </div>
    </div>
  )
}