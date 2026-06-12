'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function ProductionOrdersTable({
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
          href={`/admin/production-orders/${row.id}`}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          {row.po_number as string}
        </Link>
      ),
    },
    {
      key: 'items',
      label: 'Item',
      render: (value: unknown) =>
        (value as { name?: string })?.name ?? '-',
    },
    {
      key: 'bom_headers',
      label: 'BOM',
      render: (value: unknown) =>
        (value as { bom_name?: string })?.bom_name ?? '-',
    },
    {
      key: 'planned_qty',
      label: 'Planned Qty',
      className: 'text-right',
    },
    {
      key: 'produced_qty',
      label: 'Produced',
      className: 'text-right',
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
      emptyMessage="No production orders found."
    />
  )
}
