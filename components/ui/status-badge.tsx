const statusColors: Record<string, string> = {
  Draft: 'bg-gray-900/60 text-gray-300 ring-gray-600',
  Pending: 'bg-amber-900/60 text-amber-300 ring-amber-500',
  Submitted: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Sent: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Planned: 'bg-gray-900/60 text-gray-300 ring-gray-600',
  Active: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Inactive: 'bg-gray-900/60 text-gray-300 ring-gray-600',
  Confirmed: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Approved: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Validated: 'bg-green-900/60 text-green-300 ring-green-500',
  Enriched: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Accepted: 'bg-green-900/60 text-green-300 ring-green-500',
  Completed: 'bg-green-900/60 text-green-300 ring-green-500',
  Paid: 'bg-green-900/60 text-green-300 ring-green-500',
  Unpaid: 'bg-amber-900/60 text-amber-300 ring-amber-500',
  Overdue: 'bg-red-900/60 text-red-300 ring-red-500',
  Cancelled: 'bg-red-900/60 text-red-300 ring-red-500',
  Rejected: 'bg-red-900/60 text-red-300 ring-red-500',
  Expired: 'bg-amber-900/60 text-amber-300 ring-amber-500',
  Dispatched: 'bg-blue-900/60 text-blue-300 ring-blue-500',
  Delivered: 'bg-green-900/60 text-green-300 ring-green-500',
  InProgress: 'bg-amber-900/60 text-amber-300 ring-amber-500',
  'Partially Received': 'bg-purple-900/60 text-purple-300 ring-purple-500',
}

export default function StatusBadge({ status, dot }: { status: string; dot?: boolean }) {
  const color = statusColors[status] ?? 'bg-gray-900/60 text-gray-300 ring-gray-600'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${color}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {status}
    </span>
  )
}
