import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function TransactionTable({ transactions, compact = false }) {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'destructive'
      case 'processing': return 'info'
      default: return 'secondary'
    }
  }

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'credit': return 'text-emerald-600'
      case 'debit': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/50">
          <TableHead>Date</TableHead>
          <TableHead>Transaction ID</TableHead>
          {!compact && <TableHead>Account</TableHead>}
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          {!compact && <TableHead>Reference</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txn) => (
          <TableRow key={txn.id} className="cursor-pointer">
            <TableCell className="font-medium text-gray-600 text-sm">{formatDate(txn.date)}</TableCell>
            <TableCell>
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{txn.id}</span>
            </TableCell>
            {!compact && <TableCell className="text-sm">{txn.account}</TableCell>}
            <TableCell className="text-sm font-medium text-gray-800">{txn.description}</TableCell>
            <TableCell>
              <span className={`text-sm font-semibold ${getTypeColor(txn.type)}`}>{txn.type}</span>
            </TableCell>
            <TableCell className="text-right">
              <span className={`font-semibold ${getTypeColor(txn.type)}`}>
                {txn.type === 'Credit' ? '+' : '-'}{formatCurrency(txn.amount)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(txn.status)}>{txn.status}</Badge>
            </TableCell>
            {!compact && <TableCell className="text-sm text-gray-500">{txn.reference}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
