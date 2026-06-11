'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const transitions: Record<string, string[]> = {
  pending: ['validated', 'rejected'],
  validated: ['enriched', 'rejected'],
  enriched: [],
  rejected: ['pending'],
}

export function StatusActions({ vendorId, currentStatus }: { vendorId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const allowed = transitions[currentStatus] || []

  async function updateStatus(newStatus: string) {
    setLoading(newStatus)
    setError(null)
    try {
      const res = await fetch(`/api/vendors/${vendorId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update status')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-red-400 text-xs">{error}</span>}
      {allowed.map((s) => (
        <button
          key={s}
          onClick={() => updateStatus(s)}
          disabled={loading !== null}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded transition-colors capitalize"
        >
          {loading === s ? '...' : `Mark ${s}`}
        </button>
      ))}
    </div>
  )
}
