import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, change, changeType = 'positive', icon: Icon, color = 'blue', id }) {
  const colorMap = {
    blue: 'from-blue-500 to-blue-700 shadow-blue-500/25',
    green: 'from-emerald-500 to-emerald-700 shadow-emerald-500/25',
    purple: 'from-purple-500 to-purple-700 shadow-purple-500/25',
    orange: 'from-orange-500 to-orange-700 shadow-orange-500/25',
    red: 'from-red-500 to-red-700 shadow-red-500/25',
    teal: 'from-teal-500 to-teal-700 shadow-teal-500/25',
  }

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              {changeType === 'positive' ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={cn("text-xs font-semibold", changeType === 'positive' ? 'text-emerald-600' : 'text-red-600')}>
                {change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110", colorMap[color])}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 opacity-50" />
    </div>
  )
}
