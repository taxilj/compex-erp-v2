import { createAdminClient } from '@/lib/supabase/admin'

export default async function ItemsPage() {
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from('items')
    .select('id, item_code, item_name, item_group, stock_uom, hsn_code, is_stock_item, disabled')
    .order('item_name')

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Item Code</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Item Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Group</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">UOM</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">HSN Code</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Stock Item</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Disabled</th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-mono text-xs">{item.item_code}</td>
                    <td className="py-3 px-4 text-white">{item.item_name}</td>
                    <td className="py-3 px-4 text-slate-300">{item.item_group || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{item.stock_uom || '-'}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-xs">{item.hsn_code || '-'}</td>
                    <td className="py-3 px-4 text-center">{item.is_stock_item ? <span className="text-green-400 text-xs">Yes</span> : <span className="text-slate-500 text-xs">No</span>}</td>
                    <td className="py-3 px-4 text-center">{item.disabled ? <span className="text-red-400 text-xs">Yes</span> : <span className="text-slate-500 text-xs">No</span>}</td>
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
