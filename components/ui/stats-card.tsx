import { type LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple'
  description?: string
  trend?: number
  trendDir?: 'up' | 'down'
}

const colorMap: Record<string, string> = {
  blue: 'text-blue-400',
  green: 'text-emerald-400',
  red: 'text-red-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400',
}

const bgMap: Record<string, string> = {
  blue: 'bg-blue-500/10',
  green: 'bg-emerald-500/10',
  red: 'bg-red-500/10',
  amber: 'bg-amber-500/10',
  purple: 'bg-purple-500/10',
}

export default function StatsCard({ title, value, icon: Icon, color = 'blue', description, trend, trendDir }: StatsCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-sm truncate">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colorMap[color] ?? 'text-white'}`}>{value}</p>
          {description && <p className="text-slate-500 text-xs mt-1 truncate">{description}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${trendDir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={trendDir === 'up' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
              </svg>
              {trend}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`${bgMap[color] ?? 'bg-slate-700'} rounded-lg p-2.5 flex-shrink-0 ml-3`}>
            <Icon className={`w-5 h-5 ${colorMap[color]}`} />
          </div>
        )}
      </div>
    </div>
  )
}
