'use client'

import Link from 'next/link'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'
import type { Column } from '@/components/ui/data-table'

export default function VendorsTable({
  data,
}: {
  data: Record<string, unknown>[]
}) {
  const columns: Column[] = [
    {
      key: 'company_name',
      label: 'Company',
      render: (value, row) => (
        <Link href={`/admin/vendors/${row.id}`} className="text-blue-400 hover:text-blue-300">
          {value as string}
        </Link>
      ),
    },
    { key: 'source', label: 'Source', render: (value) => (value as string).charAt(0).toUpperCase() + (value as string).slice(1) },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const s = value as string
        return <StatusBadge status={s.charAt(0).toUpperCase() + s.slice(1)} />
      },
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => new Date(value as string).toLocaleDateString('en-IN'),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={false}
      emptyMessage="No vendors found"
    />
  )
}
