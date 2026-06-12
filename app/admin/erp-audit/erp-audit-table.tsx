'use client'

import DataTable from '@/components/ui/data-table'
import type { Column } from '@/components/ui/data-table'

export default function ErpAuditTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  const columns: Column[] = [
    {
      key: 'entry_date',
      label: 'Date',
      render: (value) => new Date(value as string).toLocaleDateString('en-IN'),
    },
    { key: 'account_name', label: 'Account' },
    {
      key: 'debit',
      label: 'Debit',
      render: (value) => fmt(Number(value)),
      className: 'text-right font-mono',
    },
    {
      key: 'credit',
      label: 'Credit',
      render: (value) => fmt(Number(value)),
      className: 'text-right font-mono',
    },
    { key: 'description', label: 'Description', render: (value) => (value as string) || '—' },
    { key: 'reference_type', label: 'Reference', render: (value) => (value as string) || '—' },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={true}
      emptyMessage="No journal entries found"
    />
  )
}
