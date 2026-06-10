export default function Loading() {
  return (
    <div>
      <div className="h-7 w-48 bg-slate-700 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-slate-700 mb-2" />
            <div className="h-3 w-20 bg-slate-700 rounded mb-2" />
            <div className="h-7 w-16 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 animate-pulse">
            <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
            <div className="h-64 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
