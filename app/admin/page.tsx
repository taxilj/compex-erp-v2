import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import DashboardClient from './client'

export default async function AdminPage() {
  const session = await auth()
  const supabase = createAdminClient()

  const { count: totalItems } = await supabase.from('items').select('*', { count: 'exact', head: true })
  const { count: totalSuppliers } = await supabase.from('suppliers').select('*', { count: 'exact', head: true })
  const { count: totalCustomers } = await supabase.from('customers').select('*', { count: 'exact', head: true })

  const { data: recentInvoices } = await supabase
    .from('sales_invoices')
    .select('invoice_number, grand_total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: invoices } = await supabase
    .from('sales_invoices')
    .select('grand_total, created_at')

  return (
    <DashboardClient
      userName={session?.user?.name || 'Admin'}
      totalItems={totalItems ?? 0}
      totalSuppliers={totalSuppliers ?? 0}
      totalCustomers={totalCustomers ?? 0}
      recentInvoices={recentInvoices ?? []}
      invoices={invoices ?? []}
    />
  )
}
