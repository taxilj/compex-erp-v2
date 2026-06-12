'use client'

import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'

export default function ItemsTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    {
      key: 'item_code',
      label: 'Code',
      render: (value: unknown) => (
        <span className="font-mono text-xs text-white">{value as string}</span>
      ),
    },
    { key: 'item_name', label: 'Name' },
    { key: 'item_group', label: 'Group' },
    { key: 'stock_uom', label: 'UOM' },
    { key: 'hsn_code', label: 'HSN', className: 'font-mono text-xs' },
    {
      key: 'is_stock_item',
      label: 'Stock Item',
      render: (value: unknown) =>
        value ? (
          <span className="text-green-400 text-xs">Yes</span>
        ) : (
          <span className="text-slate-500 text-xs">No</span>
        ),
    },
    {
      key: 'disabled',
      label: 'Status',
      render: (value: unknown) => (
        <StatusBadge status={value ? 'Inactive' : 'Active'} />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      emptyMessage="No items found."
    />
  )
}
