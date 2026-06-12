'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function MaterialRequestsTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'mr_number',
      label: 'MR#',
      render: (_: unknown, row: Record<string, unknown>) => (
        <Link
          href={`/admin/material-requests/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.mr_number as string}
        </Link>
      ),
    },
    {
      key: 'suppliers',
      label: 'Supplier',
      render: (value: unknown) =>
        (value as { name?: string })?.name ?? '-',
    },
    {
      key: 'request_date',
      label: 'Date',
      render: (value: unknown) =>
        value
          ? new Date(value as string).toLocaleDateString('en-IN')
          : '-',
    },
    {
      key: 'expected_date',
      label: 'Expected',
      render: (value: unknown) =>
        value
          ? new Date(value as string).toLocaleDateString('en-IN')
          : '-',
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
      emptyMessage="No material requests found."
    />
  )
}
