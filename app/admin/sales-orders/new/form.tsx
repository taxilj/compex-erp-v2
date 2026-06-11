'use client'

import { useState } from 'react'
import { createSalesOrder } from '@/lib/actions/sales-orders'
import Link from 'next/link'

interface CustomerOption { id: number; name: string }
interface ItemOption { id: number; name: string; sku: string }
interface QuoteOption { id: string; quote_number: string; customers: { name: string } | null }

interface LineRow {
  itemId: number | null
  description: string
  qty: string
  rate: string
}

export function NewSalesOrderForm({ customers, items, quotations }: { customers: CustomerOption[]; items: ItemOption[]; quotations: QuoteOption[] }) {
  const [rows, setRows] = useState<LineRow[]>([{ itemId: null, description: '', qty: '1', rate: '0' }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const addRow = () => setRows(prev => [...prev, { itemId: null, description: '', qty: '1', rate: '0' }])
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i))
  const updateRow = (i: number, field: keyof LineRow, value: string | number | null) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))

  const subtotal = rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.rate) || 0), 0)
  const gst = subtotal * 0.18
  const grandTotal = subtotal + gst

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const valid = rows.filter(r => r.itemId !== null)
    if (valid.length === 0) { setError('Add at least one item'); setSubmitting(false); return }

    const fd = new FormData(e.currentTarget)
    fd.set('_item_ids', JSON.stringify(valid.map(r => r.itemId)))
    fd.set('_descriptions', JSON.stringify(valid.map(r => r.description)))
    fd.set('_qtys', JSON.stringify(valid.map(r => Number(r.qty) || 1)))
    fd.set('_rates', JSON.stringify(valid.map(r => Number(r.rate) || 0)))

    try { await createSalesOrder(fd) }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to create'); setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</div>}

      <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-300">Header</h2>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Customer *</label>
          <select name="customer_id" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
            <option value="">Select customer...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Quotation (optional)</label>
          <select name="quotation_id" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
            <option value="">None</option>
            {quotations.map(q => <option key={q.id} value={q.id}>{q.quote_number} - {q.customers?.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Order Date</label>
            <input name="order_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Delivery Date</label>
            <input name="delivery_date" type="date" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Notes</label>
          <input name="notes" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-300">Items</h2>
          <button type="button" onClick={addRow} className="rounded-lg bg-green-700 px-3 py-1.5 text-xs text-white transition-colors hover:bg-green-600">+ Add Row</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-2 py-2 text-left font-medium text-slate-400">#</th>
                <th className="px-2 py-2 text-left font-medium text-slate-400">Item *</th>
                <th className="px-2 py-2 text-left font-medium text-slate-400">Description</th>
                <th className="px-2 py-2 text-right font-medium text-slate-400">Qty</th>
                <th className="px-2 py-2 text-right font-medium text-slate-400">Rate</th>
                <th className="px-2 py-2 text-right font-medium text-slate-400">Amount</th>
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-700/50">
                  <td className="px-2 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-2 py-2">
                    <select value={row.itemId ?? ''} onChange={e => updateRow(i, 'itemId', e.target.value ? Number(e.target.value) : null)} className="w-full rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none">
                      <option value="">Select...</option>
                      {items.map(item => <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input value={row.description} onChange={e => updateRow(i, 'description', e.target.value)} className="w-full rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" step="0.01" min="0.01" value={row.qty} onChange={e => updateRow(i, 'qty', e.target.value)} className="w-20 rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-right text-xs text-white focus:border-blue-500 focus:outline-none" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" step="0.01" min="0" value={row.rate} onChange={e => updateRow(i, 'rate', e.target.value)} className="w-24 rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-right text-xs text-white focus:border-blue-500 focus:outline-none" />
                  </td>
                  <td className="px-2 py-2 text-right text-xs text-slate-300">₹{((Number(row.qty) || 0) * (Number(row.rate) || 0)).toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2">
                    {rows.length > 1 && <button type="button" onClick={() => removeRow(i)} className="text-sm text-red-400 hover:text-red-300">&times;</button>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800">
              <tr><td colSpan={5} className="px-2 py-3 text-right text-slate-400">Subtotal</td><td className="px-2 py-3 text-right text-white">₹{subtotal.toLocaleString('en-IN')}</td><td /></tr>
              <tr><td colSpan={5} className="px-2 py-1 text-right text-slate-400">GST (18%)</td><td className="px-2 py-1 text-right text-white">₹{gst.toLocaleString('en-IN')}</td><td /></tr>
              <tr><td colSpan={5} className="px-2 py-3 text-right font-medium text-white">Grand Total</td><td className="px-2 py-3 text-right font-bold text-white">₹{grandTotal.toLocaleString('en-IN')}</td><td /></tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Creating...' : 'Create Sales Order'}
        </button>
        <Link href="/admin/sales-orders" className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm text-white transition-colors hover:bg-slate-600">Cancel</Link>
      </div>
    </form>
  )
}
