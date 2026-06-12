'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function SalesOrdersTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'so_number',
      label: 'SO#',
      render: (_: unknown, row: Record<string, unknown>) => (
        <Link
          href={`/admin/sales-orders/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.so_number as string}
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
      key: 'quotations',
      label: 'Quote Ref',
      render: (value: unknown) =>
        (value as { quote_number?: string })?.quote_number ?? '-',
    },
    {
      key: 'order_date',
      label: 'Order Date',
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
      emptyMessage="No sales orders found."
    />
  )
}
