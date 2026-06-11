'use client'

import { useState } from 'react'
import { createProductionOrder } from '@/lib/actions/production-orders'
import Link from 'next/link'

interface ItemOption { id: number; name: string; sku: string }
interface BOMOption { id: number; bom_name: string; items: { name: string } | null }

export function NewProductionOrderForm({ items, boms }: { items: ItemOption[]; boms: BOMOption[] }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try { await createProductionOrder(new FormData(e.currentTarget)) }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to create'); setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</div>}

      <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-300">Production Order Details</h2>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Item *</label>
          <select name="item_id" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
            <option value="">Select item...</option>
            {items.map(item => <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">BOM *</label>
          <select name="bom_header_id" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
            <option value="">Select BOM...</option>
            {boms.map(bom => <option key={bom.id} value={bom.id}>{bom.bom_name} ({bom.items?.name})</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Planned Qty *</label>
          <input name="planned_qty" type="number" step="0.01" min="0.01" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Start Date</label>
            <input name="start_date" type="date" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">End Date</label>
            <input name="end_date" type="date" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Notes</label>
          <input name="notes" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Creating...' : 'Create Production Order'}
        </button>
        <Link href="/admin/production-orders" className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm text-white transition-colors hover:bg-slate-600">Cancel</Link>
      </div>
    </form>
  )
}
