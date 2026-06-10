import { createAdminClient } from '@/lib/supabase/admin'

export default async function SuppliersPage() {
  const supabase = createAdminClient()
  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('id, name, contact_person, phone, city, gst')
    .order('name')

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Contact Person</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">City</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">GST</th>
              </tr>
            </thead>
            <tbody>
              {!suppliers || suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white">{supplier.name}</td>
                    <td className="py-3 px-4 text-slate-300">{supplier.contact_person || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{supplier.phone || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{supplier.city || '-'}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-xs">{supplier.gst || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
