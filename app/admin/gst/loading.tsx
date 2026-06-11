export default function Loading() {
  return (
    <div>
      <div className="h-7 w-48 bg-slate-700 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 animate-pulse">
            <div className="h-3 w-20 bg-slate-700 rounded mb-2" />
            <div className="h-7 w-24 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse">
            <div className="h-5 w-24 bg-slate-700 rounded mb-2" />
            <div className="h-3 w-48 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
