import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ItemsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: items } = await supabase
    .from('items')
    .select('id, name, sku, rate, category, unit')
    .order('name')

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">SKU</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Rate</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white">{item.name}</td>
                    <td className="py-3 px-4 text-slate-300">{item.sku}</td>
                    <td className="py-3 px-4 text-right text-white">
                      ₹{Number(item.rate).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.category || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{item.unit || '-'}</td>
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
