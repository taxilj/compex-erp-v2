'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function GRNTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'grn_number',
      label: 'GRN#',
      render: (_: unknown, row: Record<string, unknown>) => (
        <Link
          href={`/admin/grn/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.grn_number as string}
        </Link>
      ),
    },
    {
      key: 'purchase_orders',
      label: 'PO#',
      render: (value: unknown) =>
        (value as { po_number?: string })?.po_number ?? '-',
    },
    {
      key: 'suppliers',
      label: 'Supplier',
      render: (value: unknown) =>
        (value as { name?: string })?.name ?? '-',
    },
    {
      key: 'received_date',
      label: 'Received',
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
      emptyMessage="No goods receipt notes found."
    />
  )
}
