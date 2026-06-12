export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-700" />
      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-slate-700" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="mb-1 h-3 w-16 animate-pulse rounded bg-slate-700" />
              <div className="h-5 w-32 animate-pulse rounded bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
