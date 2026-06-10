'use client'

export default function SuppliersError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="w-12 h-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <h2 className="text-lg font-medium text-white mb-2">Something went wrong loading suppliers</h2>
      <p className="text-slate-400 text-sm mb-6">Please try again or contact support.</p>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors">
        Try Again
      </button>
    </div>
  )
}
