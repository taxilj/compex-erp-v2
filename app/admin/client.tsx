'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

type Invoice = { total_amount: number; created_at: string }

export default function DashboardClient({
  userName,
  totalItems,
  totalSuppliers,
  totalCustomers,
  recentInvoices,
  invoices,
}: {
  userName: string
  totalItems: number
  totalSuppliers: number
  totalCustomers: number
  recentInvoices: { invoice_number: string; total_amount: number; status: string; created_at: string }[]
  invoices: Invoice[]
}) {
  const chartData = useMemo(() => {
    const months: Record<string, number> = {}
    invoices.forEach((inv) => {
      const m = inv.created_at?.slice(0, 7)
      if (m) months[m] = (months[m] || 0) + Number(inv.total_amount)
    })
    return Object.entries(months).map(([month, amount]) => ({ month, amount }))
  }, [invoices])

  const stats = [
    { label: 'Total Items', value: totalItems, color: 'bg-blue-500' },
    { label: 'Suppliers', value: totalSuppliers, color: 'bg-emerald-500' },
    { label: 'Customers', value: totalCustomers, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl text-white mb-6">Welcome, {userName}</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <div className={`w-3 h-3 rounded-full ${s.color} mb-2`} />
            <p className="text-slate-400 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-white font-medium mb-4">Revenue Overview</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm">No invoice data yet</p>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-white font-medium mb-4">Recent Invoices</h2>
          {recentInvoices.length > 0 ? (
            <div className="space-y-3">
              {recentInvoices.map((inv) => (
                <div key={inv.invoice_number} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white text-sm">{inv.invoice_number}</p>
                    <p className="text-slate-500 text-xs">{inv.created_at?.slice(0, 10)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">₹{Number(inv.total_amount).toLocaleString('en-IN')}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${inv.status === 'Paid' ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No recent invoices</p>
          )}
        </div>
      </div>
    </div>
  )
}
