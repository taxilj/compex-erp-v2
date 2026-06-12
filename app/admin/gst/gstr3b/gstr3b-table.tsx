'use client'

import DataTable from '@/components/ui/data-table'

export default function Gstr3bTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns = [
    { key: 'rate', label: 'GST Rate' },
    {
      key: 'taxable',
      label: 'Taxable Value',
      className: 'text-right font-mono',
    },
    {
      key: 'gst',
      label: 'GST Amount',
      className: 'text-right font-mono',
    },
    {
      key: 'count',
      label: 'Lines',
      className: 'text-right',
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable={false}
      emptyMessage="No data for selected period"
    />
  )
}
