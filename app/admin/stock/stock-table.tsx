'use client'

import DataTable from '@/components/ui/data-table'

export default function StockTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'warehouse', label: 'Warehouse' },
    {
      key: 'quantity',
      label: 'Quantity',
      className: 'text-right',
      render: (value: unknown) =>
        (value as number)?.toLocaleString('en-IN'),
    },
    {
      key: 'rate',
      label: 'Rate',
      className: 'text-right',
      render: (value: unknown) =>
        `\u20B9${(value as number)?.toLocaleString('en-IN')}`,
    },
    {
      key: 'value',
      label: 'Value',
      className: 'text-right',
      render: (value: unknown) =>
        `\u20B9${(value as number)?.toLocaleString('en-IN')}`,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No stock entries found."
    />
  )
}
