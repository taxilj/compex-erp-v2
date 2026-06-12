'use client'

import DataTable from '@/components/ui/data-table'

export default function ReceivablesTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const columns = [
    {
      key: 'customer_name',
      label: 'Customer',
      render: (value: unknown) => (value as string) ?? 'Unknown',
    },
    { key: 'invoice_number', label: 'Invoice #' },
    {
      key: 'invoice_date',
      label: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN'),
    },
    {
      key: 'grand_total',
      label: 'Amount Due',
      render: (value: unknown) => fmt(Number(value)),
      className: 'text-right font-mono',
    },
    {
      key: 'days_overdue',
      label: 'Days Overdue',
      render: (value: unknown) => {
        const d = value as number
        return d > 0 ? <span className="text-red-400 font-medium">{d}d</span> : '\u2014'
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <span className={value === 'Overdue' ? 'text-red-400' : 'text-yellow-400'}>
          {value as string}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={true}
      emptyMessage="No outstanding invoices"
    />
  )
}
