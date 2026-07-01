export default function SessionWarningModal({ visible, secondsLeft, onContinue }) {
  if (!visible) return null

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Are you still there?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your session has been active for 1 hour. For your security you will be
          logged out automatically in{' '}
          <span className="font-semibold text-red-500">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>{' '}
          unless you continue.
        </p>
        <button
          onClick={onContinue}
          className="w-full py-2 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
        >
          Continue Session
        </button>
      </div>
    </div>
  )
}
