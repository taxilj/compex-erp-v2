export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 animate-pulse">
            <div className="h-3 w-24 bg-slate-700 rounded mb-3" />
            <div className="h-7 w-32 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 animate-pulse">
        <div className="h-4 w-48 bg-slate-700 rounded mb-6" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-700/50 rounded mb-2" />
        ))}
      </div>
    </div>
  )
}
