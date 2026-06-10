'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Items', href: '/admin/items', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { label: 'Stock', href: '/admin/stock', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { label: 'Suppliers', href: '/admin/suppliers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { label: 'Customers', href: '/admin/customers', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { label: 'Purchase Orders', href: '/admin/purchase-orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Sales Invoices', href: '/admin/invoices', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Finance', href: '/admin/finance/receivables', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'ERP Audit', href: '/admin/erp-audit', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex">
      <aside className={`bg-[#0f172a] text-white flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="8" stroke="#2563eb" strokeWidth="4" fill="none" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="45" x2="60" y2="45" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="60" x2="50" y2="60" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <circle cx="72" cy="68" r="14" stroke="#2563eb" strokeWidth="3" fill="none" />
            <line x1="82" y1="78" x2="90" y2="86" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {!collapsed && <span className="font-bold text-blue-500">Compex ERP</span>}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-xs text-slate-500 hover:text-white py-1"
          >
            {collapsed ? '→' : 'Collapse'}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-red-600 hover:text-white rounded transition-colors mt-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-slate-900 min-h-screen overflow-auto">
        <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <h2 className="text-white font-medium">
            {navItems.find(i => i.href === pathname)?.label || 'Compex ERP'}
          </h2>
          <div className="text-slate-400 text-sm">₹ INR</div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
