'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function DeliveryNotesTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'dn_number',
      label: 'DN#',
      render: (_: unknown, row: Record<string, unknown>) => (
        <Link
          href={`/admin/delivery-notes/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.dn_number as string}
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
      key: 'sales_orders',
      label: 'SO Ref',
      render: (value: unknown) =>
        (value as { so_number?: string })?.so_number ?? '-',
    },
    {
      key: 'delivery_date',
      label: 'Delivery Date',
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
      emptyMessage="No delivery notes found."
    />
  )
}
