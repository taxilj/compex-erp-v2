'use client'

import { useState, useMemo, type ReactNode } from 'react'

export interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode
  className?: string
  sortable?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  searchable?: boolean
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  pageSize?: number
  selectable?: boolean
  onSelectionChange?: (selected: string[]) => void
}

export default function DataTable({
  columns,
  data,
  searchable,
  loading,
  emptyMessage = 'No data found',
  emptyIcon,
  pageSize,
  selectable,
  onSelectionChange,
}: DataTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = data
    if (searchable && search) {
      const q = search.toLowerCase()
      result = result.filter((row) =>
        columns.some((col) => {
          const val = row[col.key]
          return val != null && String(val).toLowerCase().includes(q)
        }),
      )
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = typeof aVal === 'number' ? aVal - Number(bVal) : String(aVal).localeCompare(String(bVal))
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return result
  }, [data, search, searchable, columns, sortKey, sortDir])

  const totalPages = pageSize ? Math.ceil(filtered.length / pageSize) : 1
  const paged = pageSize ? filtered.slice(page * pageSize, (page + 1) * pageSize) : filtered

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      onSelectionChange?.(next)
      return next
    })
  }

  function toggleAll() {
    const pageIds = paged.map((r) => String(r.id ?? ''))
    const allSelected = pageIds.every((id) => selected.includes(id))
    setSelected((prev) => {
      const next = allSelected ? prev.filter((id) => !pageIds.includes(id)) : [...prev, ...pageIds.filter((id) => !prev.includes(id))]
      onSelectionChange?.(next)
      return next
    })
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="w-full sm:w-64 bg-slate-700 text-white rounded pl-9 pr-3 py-2 text-sm border border-slate-600 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-slate-700 bg-slate-800/95 backdrop-blur-sm">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && paged.every((r) => selected.includes(String(r.id ?? '')))}
                    onChange={toggleAll}
                    className="rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-3 px-4 text-slate-400 font-medium ${col.className ?? ''} ${col.sortable ? 'cursor-pointer select-none hover:text-white transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={sortDir === 'asc' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={selectable ? columns.length + 1 : columns.length} className="py-12 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={selectable ? columns.length + 1 : columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon && <span className="text-slate-600">{emptyIcon}</span>}
                    <span className="text-slate-500">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={(row.id as string) ?? i}
                  className={`border-b border-slate-700/50 last:border-0 even:bg-slate-700/10 hover:bg-slate-700/30 transition-colors ${selected.includes(String(row.id ?? '')) ? 'bg-blue-900/20' : ''}`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(String(row.id ?? ''))}
                        onChange={() => toggleSelect(String(row.id ?? ''))}
                        className="rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={`py-3 px-4 text-slate-300 ${col.className ?? ''}`}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] as ReactNode) ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pageSize && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
          <span className="text-xs text-slate-400">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
