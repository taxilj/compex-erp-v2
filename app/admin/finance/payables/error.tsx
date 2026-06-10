'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-red-400 text-lg mb-2">Failed to load payables</p>
      <p className="text-slate-500 text-sm mb-4">An unexpected error occurred</p>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Retry
      </button>
    </div>
  )
}
