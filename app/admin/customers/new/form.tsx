'use client'

import { useState } from 'react'
import { createCustomer } from '@/lib/actions/customers'
import Link from 'next/link'

export function NewCustomerForm() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const result = await createCustomer(fd)
    if (!result.success) {
      setError(result.error || 'Failed to create')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</div>}

      <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-300">Customer Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Name *</label>
            <input name="name" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Email *</label>
            <input name="email" type="email" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Phone *</label>
            <input name="phone" required className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">GST</label>
            <input name="gst" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Contact Person</label>
            <input name="contact_person" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">City</label>
            <input name="city" className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Address *</label>
          <textarea name="address" rows={3} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Creating...' : 'Create Customer'}
        </button>
        <Link href="/admin/customers" className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm text-white transition-colors hover:bg-slate-600">Cancel</Link>
      </div>
    </form>
  )
}
