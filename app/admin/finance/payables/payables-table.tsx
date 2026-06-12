'use client'

import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function PayablesTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const columns = [
    {
      key: 'supplier_name',
      label: 'Supplier',
      render: (value: unknown) => (value as string) ?? 'Unknown',
    },
    { key: 'po_number', label: 'PO #' },
    {
      key: 'order_date',
      label: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN'),
    },
    {
      key: 'grand_total',
      label: 'Amount',
      render: (value: unknown) => fmt(Number(value)),
      className: 'text-right font-mono',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={true}
      emptyMessage="No outstanding payables"
    />
  )
}
