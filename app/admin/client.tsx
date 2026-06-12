'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import StatsCard from '@/components/ui/stats-card'
import StatusBadge from '@/components/ui/status-badge'
import { Box, Users, Building2, IndianRupee, ShoppingCart, AlertTriangle, Warehouse, ArrowRight, FileText, Package, Truck } from 'lucide-react'

interface LowStockItem {
  name: string
  quantity: number
  bin: string
  warehouse: string
}

interface MonthlyRevenue {
  month: string
  amount: number
}

interface DashboardClientProps {
  totalItems: number
  totalSuppliers: number
  totalCustomers: number
  totalRevenue: number
  unpaidInvoiceCount: number
  pendingPOCount: number
  stockValue: number
  lowStockItems: LowStockItem[]
  debitTotal: number
  creditTotal: number
  monthlyRevenue: MonthlyRevenue[]
}

const actions = [
  { label: 'New Invoice', href: '/admin/invoices', icon: FileText, color: 'text-blue-400' },
  { label: 'New PO', href: '/admin/purchase-orders', icon: Package, color: 'text-emerald-400' },
  { label: 'New MR', href: '/admin/material-requests', icon: Truck, color: 'text-purple-400' },
  { label: 'Stock', href: '/admin/stock', icon: Warehouse, color: 'text-amber-400' },
]

export default function DashboardClient({
  totalItems,
  totalSuppliers,
  totalCustomers,
  totalRevenue,
  unpaidInvoiceCount,
  pendingPOCount,
  stockValue,
  lowStockItems,
  debitTotal,
  creditTotal,
  monthlyRevenue,
}: DashboardClientProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of your ERP system</p>
        </div>
        <div className="flex gap-2">
          {actions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-sm border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <a.icon className={`w-4 h-4 ${a.color}`} />
              <span className="hidden sm:inline">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <StatsCard title="Items" value={totalItems} icon={Box} color="blue" description="Active inventory items" />
        <StatsCard title="Suppliers" value={totalSuppliers} icon={Users} color="green" description="Registered suppliers" />
        <StatsCard title="Customers" value={totalCustomers} icon={Building2} color="amber" description="Active customers" />
        <StatsCard title="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} color="blue" description="Total invoiced" />
        <StatsCard title="Stock Value" value={`₹${stockValue.toLocaleString('en-IN')}`} icon={Warehouse} color="purple" />
        <StatsCard
          title="Pending POs"
          value={pendingPOCount}
          icon={ShoppingCart}
          color="amber"
          description={pendingPOCount > 0 ? 'Awaiting approval' : 'All cleared'}
        />
        <StatsCard
          title="Unpaid Invoices"
          value={unpaidInvoiceCount}
          icon={AlertTriangle}
          color={unpaidInvoiceCount > 0 ? 'red' : 'green'}
          description={unpaidInvoiceCount > 0 ? 'Requires attention' : 'All paid'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-white font-medium mb-4">Revenue Overview</h2>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">No revenue data yet</div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-white font-medium mb-4">GL Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Debits</span>
              <span className="text-red-400 font-medium">₹{debitTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Credits</span>
              <span className="text-emerald-400 font-medium">₹{creditTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm font-medium">Net</span>
                <span className={`font-bold ${creditTotal >= debitTotal ? 'text-emerald-400' : 'text-red-400'}`}>
                  ₹{(creditTotal - debitTotal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/erp-audit"
            className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View detailed report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-medium">Low Stock Alerts</h2>
            <span className="text-xs text-amber-400 bg-amber-500/10 rounded-full px-2 py-0.5">{lowStockItems.length} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="py-2 px-3 font-medium">Item</th>
                  <th className="py-2 px-3 font-medium">Qty</th>
                  <th className="py-2 px-3 font-medium">Bin</th>
                  <th className="py-2 px-3 font-medium">Warehouse</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, i) => (
                  <tr key={i} className="border-b border-slate-700/50 last:border-0">
                    <td className="py-2.5 px-3 text-slate-300">{item.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-red-400 font-medium">{item.quantity}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{item.bin}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/admin/stock"
            className="flex items-center gap-1 mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all stock <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <Link href="/admin/bom" className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 transition-all text-center">
          <p className="text-slate-400 text-xs">Bills of</p>
          <p className="text-white text-sm font-medium">Materials</p>
        </Link>
        <Link href="/admin/suppliers" className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-green-500/50 transition-all text-center">
          <p className="text-slate-400 text-xs">Manage</p>
          <p className="text-white text-sm font-medium">Suppliers</p>
        </Link>
        <Link href="/admin/production-orders" className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all text-center">
          <p className="text-slate-400 text-xs">Production</p>
          <p className="text-white text-sm font-medium">Orders</p>
        </Link>
        <Link href="/admin/gst" className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-all text-center">
          <p className="text-slate-400 text-xs">GST</p>
          <p className="text-white text-sm font-medium">Reports</p>
        </Link>
      </div>
    </div>
  )
}
