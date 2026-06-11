'use client'

const colors: Record<string, string> = {
  pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  validated: 'bg-green-900/50 text-green-300 border-green-700',
  rejected: 'bg-red-900/50 text-red-300 border-red-700',
  enriched: 'bg-blue-900/50 text-blue-300 border-blue-700',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded border capitalize ${colors[status] || 'bg-slate-700 text-slate-300'}`}>
      {status}
    </span>
  )
}
