import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function ProductionOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: po } = await supabase
    .from('production_orders')
    .select('*, items(name), bom_headers(bom_name)')
    .eq('id', id)
    .single()

  if (!po) notFound()

  const statusStyles: Record<string, string> = {
    Planned: 'bg-slate-100 text-slate-800',
    InProgress: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Link href="/admin/production-orders" className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300">
        &larr; Back to Production Orders
      </Link>

      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{po.po_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[po.status] || 'bg-slate-100 text-slate-800'}`}>
            {po.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Item</span>
            <p className="font-medium text-white">{po.items?.name}</p>
          </div>
          <div>
            <span className="text-slate-400">BOM</span>
            <p className="font-medium text-white">{po.bom_headers?.bom_name || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">Planned Qty</span>
            <p className="font-medium text-white">{po.planned_qty}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Produced Qty</span>
            <p className="font-medium text-white">{po.produced_qty}</p>
          </div>
          <div>
            <span className="text-slate-400">Start Date</span>
            <p className="font-medium text-white">{po.start_date ? new Date(po.start_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
          <div>
            <span className="text-slate-400">End Date</span>
            <p className="font-medium text-white">{po.end_date ? new Date(po.end_date).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        </div>
        {po.notes && (
          <div className="mt-4 text-sm">
            <span className="text-slate-400">Notes</span>
            <p className="mt-1 text-white">{po.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
