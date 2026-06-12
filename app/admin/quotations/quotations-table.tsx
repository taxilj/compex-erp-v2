'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function QuotationsTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'quote_number',
      label: 'Quote#',
      render: (_: unknown, row: Record<string, unknown>) => (
        <Link
          href={`/admin/quotations/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.quote_number as string}
        </Link>
      ),
    },
    {
      key: 'customers',
      label: 'Customer',
      render: (value: unknown) =>
        (value as { name?: string })?.name ?? '-',
    },
    {
      key: 'quote_date',
      label: 'Date',
      render: (value: unknown) =>
        value
          ? new Date(value as string).toLocaleDateString('en-IN')
          : '-',
    },
    {
      key: 'grand_total',
      label: 'Amount',
      className: 'text-right',
      render: (value: unknown) =>
        `₹${Number(value ?? 0).toLocaleString('en-IN')}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <StatusBadge status={value as string} />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No quotations found."
    />
  )
}
