'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function PurchaseOrdersTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'po_number',
      label: 'PO#',
      render: (_: unknown, row: Record<string, unknown>) => (
        <Link
          href={`/admin/purchase-orders/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.po_number as string}
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
      key: 'order_date',
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
    {
      key: 'grand_total',
      label: 'Amount',
      className: 'text-right',
      render: (value: unknown) =>
        `₹${Number(value ?? 0).toLocaleString('en-IN')}`,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No purchase orders found."
    />
  )
}
