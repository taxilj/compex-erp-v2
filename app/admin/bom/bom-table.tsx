'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'

export default function BomTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'finished_item_name',
      label: 'Finished Item',
      render: (value: unknown, row: Record<string, unknown>) => (
        <Link href={`/admin/bom/${row.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
          {value as string}
        </Link>
      ),
    },
    { key: 'finished_item_sku', label: 'SKU' },
    { key: 'quantity', label: 'Qty' },
    { key: 'component_count', label: 'Components' },
    { key: 'notes', label: 'Notes', render: (value: unknown) => (value as string) || '\u2014' },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN'),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable={true}
      emptyMessage="No BOMs found"
    />
  )
}
