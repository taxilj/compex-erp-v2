import Link from 'next/link'
import { NewCustomerForm } from './form'

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="text-sm text-slate-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-xl font-semibold text-white">New Customer</h1>
      </div>
      <NewCustomerForm />
    </div>
  )
}
