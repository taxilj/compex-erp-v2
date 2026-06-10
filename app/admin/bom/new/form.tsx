'use client'

import { useState } from 'react'
import { createBom } from '@/lib/actions/bom'
import Link from 'next/link'

interface ItemOption {
  id: number
  name: string
  sku: string
}

interface ComponentRow {
  itemId: number | null
  qty: string
  unit: string
  scrap: string
}

export function NewBomForm({ items }: { items: ItemOption[] }) {
  const [components, setComponents] = useState<ComponentRow[]>([
    { itemId: null, qty: '1', unit: 'pcs', scrap: '0' },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const addComponent = () => {
    setComponents(prev => [...prev, { itemId: null, qty: '1', unit: 'pcs', scrap: '0' }])
  }

  const removeComponent = (index: number) => {
    setComponents(prev => prev.filter((_, i) => i !== index))
  }

  const updateComponent = (index: number, field: keyof ComponentRow, value: string | number | null) => {
    setComponents(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const valid = components.filter(c => c.itemId !== null)
    if (valid.length === 0) {
      setError('Add at least one component')
      setSubmitting(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('_component_items', JSON.stringify(valid.map(c => c.itemId)))
    formData.set('_component_qtys', JSON.stringify(valid.map(c => Number(c.qty) || 1)))
    formData.set('_component_units', JSON.stringify(valid.map(c => c.unit || 'pcs')))
    formData.set('_component_scrap', JSON.stringify(valid.map(c => Number(c.scrap) || 0)))

    try {
      await createBom(formData)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create BOM')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Header</h2>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Finished Item *</label>
          <select name="finished_item_id" required className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="">Select item...</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Assembly Qty</label>
            <input name="quantity" type="number" step="0.01" min="0.01" defaultValue="1" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Notes</label>
            <input name="notes" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Components</h2>
          <button type="button" onClick={addComponent} className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg transition-colors">
            + Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-2 text-slate-400 font-medium">#</th>
                <th className="text-left py-2 px-2 text-slate-400 font-medium">Component *</th>
                <th className="text-right py-2 px-2 text-slate-400 font-medium">Qty</th>
                <th className="text-left py-2 px-2 text-slate-400 font-medium">Unit</th>
                <th className="text-right py-2 px-2 text-slate-400 font-medium">Scrap %</th>
                <th className="py-2 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {components.map((comp, i) => (
                <tr key={i} className="border-b border-slate-700/50">
                  <td className="py-2 px-2 text-slate-400">{i + 1}</td>
                  <td className="py-2 px-2">
                    <select
                      value={comp.itemId ?? ''}
                      onChange={e => updateComponent(i, 'itemId', e.target.value ? Number(e.target.value) : null)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select...</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input type="number" step="0.01" min="0.01" value={comp.qty} onChange={e => updateComponent(i, 'qty', e.target.value)} className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-xs text-right focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-2">
                    <input value={comp.unit} onChange={e => updateComponent(i, 'unit', e.target.value)} className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-2">
                    <input type="number" step="0.1" min="0" max="100" value={comp.scrap} onChange={e => updateComponent(i, 'scrap', e.target.value)} className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white text-xs text-right focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-2">
                    {components.length > 1 && (
                      <button type="button" onClick={() => removeComponent(i)} className="text-red-400 hover:text-red-300 text-sm">&times;</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors">
          {submitting ? 'Creating...' : 'Create BOM'}
        </button>
        <Link href="/admin/bom" className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">Cancel</Link>
      </div>
    </form>
  )
}
