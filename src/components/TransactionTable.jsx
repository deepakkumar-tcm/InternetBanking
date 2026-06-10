import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default function TransactionTable({ transactions, compact = false }) {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed': return <CheckCircle2 className="h-3 w-3 mr-1.5" />
      case 'pending':    
      case 'processing': return <Clock className="h-3 w-3 mr-1.5 animate-pulse" />
      case 'failed':     return <XCircle className="h-3 w-3 mr-1.5" />
      default:           return null
    }
  }

  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
      case 'pending':    return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
      case 'failed':     return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      default:           return ''
    }
  }

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'credit': return 'text-emerald-600 dark:text-emerald-400'
      case 'debit':  return 'text-red-600 dark:text-red-400'
      default:       return 'text-foreground'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
          <TableHead className="text-[10px] uppercase tracking-widest font-black pl-4">Timestamp</TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-black">Transaction ID</TableHead>
          {!compact && <TableHead className="text-[10px] uppercase tracking-widest font-black">Account</TableHead>}
          <TableHead className="text-[10px] uppercase tracking-widest font-black">Narration</TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-black text-right">Volume</TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-black text-center">Status</TableHead>
          {!compact && <TableHead className="text-[10px] uppercase tracking-widest font-black pr-4">Ref/Auth</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txn) => (
          <TableRow key={txn.id} className="cursor-pointer hover:bg-muted/20 border-border/10 transition-colors">
            <TableCell className="font-bold text-muted-foreground text-[12px] pl-4">{formatDate(txn.date)}</TableCell>
            <TableCell>
              <span className="font-mono text-[10px] font-black tracking-tight text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/20">{txn.id}</span>
            </TableCell>
            {!compact && <TableCell className="text-[12px] font-bold text-muted-foreground">{txn.account}</TableCell>}
            <TableCell className="text-[13px] font-black group">
               <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${txn.type === 'Credit' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {txn.description}
               </div>
            </TableCell>
            <TableCell className="text-right">
              <span className={`font-black tracking-tight ${getTypeColor(txn.type)}`}>
                <span className="text-xs mr-1 opacity-70">{txn.type === 'Credit' ? 'CR' : 'DR'}</span>
                {formatCurrency(txn.amount)}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-wider py-0.5 px-2 ${getStatusClasses(txn.status)}`}>
                 {getStatusIcon(txn.status)}
                 {txn.status}
              </Badge>
            </TableCell>
            {!compact && <TableCell className="text-[11px] font-bold text-muted-foreground pr-4 font-mono">{txn.reference}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
