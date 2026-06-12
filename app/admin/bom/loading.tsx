export default function BomLoading() {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Finished Item</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Qty</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Components</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-700/50 last:border-0">
                  <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-32 animate-pulse" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-36 animate-pulse" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-12 mx-auto animate-pulse" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-12 mx-auto animate-pulse" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
