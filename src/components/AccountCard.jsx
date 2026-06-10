import { cn, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Eye, Copy, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

export default function AccountCard({ account, id, onViewStatement, onMiniStatement, onMore }) {
  const typeColors = {
    savings: 'from-blue-600 to-indigo-700',
    current: 'from-emerald-600 to-teal-700',
    fixed:   'from-purple-600 to-violet-700',
  }

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      {/* Gradient Header */}
      <div className={cn("px-5 py-5 bg-gradient-to-r text-white", typeColors[account.type] || typeColors.savings)}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/80">{account.label}</p>
            <p className="text-2xl font-bold tracking-tight">{formatCurrency(account.balance, account.currency)}</p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
            {account.currency}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account Number</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold">{account.number}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(account.number);
                    toast.success('Account number copied to clipboard');
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy account number</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Branch</span>
          <span className="text-sm">{account.branch}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">IFSC</span>
          <span className="text-sm font-mono">{account.ifsc}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Last Activity</span>
          <span className="text-sm">{account.lastActivity}</span>
        </div>

        <Separator />

        <div className="flex items-center gap-3 pt-1">
          <Button variant="ghost" size="sm" onClick={onViewStatement} className="text-blue-600 gap-1.5 font-bold">
            <Eye className="h-3.5 w-3.5" />
            View Statement
          </Button>
          <Button variant="ghost" size="sm" onClick={onMiniStatement} className="text-blue-600 font-bold">
            Mini Statement
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onMore} className="ml-auto text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
