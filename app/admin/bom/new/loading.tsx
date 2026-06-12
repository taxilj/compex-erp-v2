export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-700" />
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-700" />
      <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="mb-1 h-3 w-24 animate-pulse rounded bg-slate-700" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-700" />
          </div>
        ))}
        <div className="h-10 w-32 animate-pulse rounded bg-blue-700" />
      </div>
    </div>
  )
}
