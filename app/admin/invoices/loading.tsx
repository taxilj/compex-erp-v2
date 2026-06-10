export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-slate-700" />
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, r) => (
              <tr key={r} className="border-t border-slate-700">
                {Array.from({ length: 6 }).map((_, c) => (
                  <td key={c} className="px-6 py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
