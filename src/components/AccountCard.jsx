import { cn, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Eye, Copy, MoreHorizontal } from 'lucide-react'

export default function AccountCard({ account, id }) {
  const typeColors = {
    savings: 'from-blue-600 to-indigo-700',
    current: 'from-emerald-600 to-teal-700',
    fixed: 'from-purple-600 to-violet-700',
  }

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      {/* Card Header with gradient */}
      <div className={cn("p-5 bg-gradient-to-r text-white", typeColors[account.type] || typeColors.savings)}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{account.label}</p>
            <p className="text-2xl font-bold mt-1 tracking-tight">{formatCurrency(account.balance, account.currency)}</p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
            {account.currency}
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account Number</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold text-gray-700">{account.number}</span>
            <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Copy">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Branch</span>
          <span className="text-sm text-gray-700">{account.branch}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">IFSC</span>
          <span className="text-sm font-mono text-gray-700">{account.ifsc}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Last Activity</span>
          <span className="text-sm text-gray-700">{account.lastActivity}</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
            <Eye className="h-3.5 w-3.5" />
            View Statement
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
            Mini Statement
          </button>
          <button className="ml-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
