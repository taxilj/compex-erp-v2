export default function Loading() {
  return (
    <div>
      <div className="h-6 w-64 bg-slate-700 rounded animate-pulse mb-6" />
      <div className="h-12 bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="mb-8">
        <div className="h-5 w-24 bg-slate-700 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-5 bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="h-5 w-24 bg-slate-700 rounded animate-pulse mb-3" />
        <div className="h-5 bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  )
}
