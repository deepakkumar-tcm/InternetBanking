import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Search, Download, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import TransactionTable from '@/components/TransactionTable'

const allTransactions = [
  { id: 'TXN001', date: '2026-03-11', account: 'Savings - 4521', description: 'Salary Credit - TechCorp', type: 'Credit', amount: 85000, status: 'Completed', reference: 'SAL/MAR/2026' },
  { id: 'TXN002', date: '2026-03-10', account: 'Savings - 4521', description: 'Amazon Purchase', type: 'Debit', amount: 2499, status: 'Success', reference: 'AMZ-78234' },
  { id: 'TXN003', date: '2026-03-10', account: 'Current - 7834', description: 'NEFT to Priya Sharma', type: 'Debit', amount: 25000, status: 'Success', reference: 'NEFT/2026/0892' },
  { id: 'TXN004', date: '2026-03-09', account: 'Savings - 4521', description: 'Electricity Bill - BESCOM', type: 'Debit', amount: 1850, status: 'Processing', reference: 'BILL/ELEC/0345' },
  { id: 'TXN005', date: '2026-03-09', account: 'Savings - 4521', description: 'Flipkart Refund', type: 'Credit', amount: 799, status: 'Completed', reference: 'FK-REF-90123' },
  { id: 'TXN006', date: '2026-03-08', account: 'Current - 7834', description: 'Office Rent Payment', type: 'Debit', amount: 35000, status: 'Success', reference: 'RENT/MAR/2026' },
  { id: 'TXN007', date: '2026-03-08', account: 'Savings - 4521', description: 'UPI - Swiggy Food', type: 'Debit', amount: 450, status: 'Success', reference: 'UPI/SWG/78234' },
  { id: 'TXN008', date: '2026-03-07', account: 'Savings - 4521', description: 'Netflix Subscription', type: 'Debit', amount: 649, status: 'Success', reference: 'NFLX-SUB-03' },
  { id: 'TXN009', date: '2026-03-07', account: 'Savings - 4521', description: 'Interest Credit', type: 'Credit', amount: 1250, status: 'Completed', reference: 'INT/Q1/2026' },
  { id: 'TXN010', date: '2026-03-06', account: 'Current - 7834', description: 'Vendor Payment - SupplyCo', type: 'Debit', amount: 48500, status: 'Success', reference: 'VND/SUP/2026' },
  { id: 'TXN011', date: '2026-03-06', account: 'Savings - 4521', description: 'Mobile Recharge - Airtel', type: 'Debit', amount: 599, status: 'Success', reference: 'RCH/AIR/78901' },
  { id: 'TXN012', date: '2026-03-05', account: 'Savings - 4521', description: 'Dividend Credit - HDFC MF', type: 'Credit', amount: 3200, status: 'Completed', reference: 'DIV/HDFC/Q1' },
  { id: 'TXN013', date: '2026-03-05', account: 'Current - 7834', description: 'Insurance Premium - LIC', type: 'Debit', amount: 12500, status: 'Success', reference: 'INS/LIC/2026' },
  { id: 'TXN014', date: '2026-03-04', account: 'Savings - 4521', description: 'ATM Withdrawal', type: 'Debit', amount: 10000, status: 'Success', reference: 'ATM/KMG/2026' },
  { id: 'TXN015', date: '2026-03-04', account: 'Savings - 4521', description: 'Cash Deposit', type: 'Credit', amount: 50000, status: 'Completed', reference: 'DEP/CASH/2026' },
]

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  const filteredTransactions = allTransactions.filter((txn) => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || txn.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType = !typeFilter || txn.type.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6 animate-fade-in" id="transactions-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">View and search all your transaction history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4" id="transaction-filters">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="txn-search"
                placeholder="Search by description, ID, or reference..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1) }}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Filter className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="txn-stats">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{filteredTransactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Credits</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              ₹{filteredTransactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Debits</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              ₹{filteredTransactions.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Net Flow</p>
            <p className="text-xl font-bold text-blue-600 mt-1">
              ₹{(filteredTransactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0) -
                filteredTransactions.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0)).toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <TransactionTable transactions={paginatedTransactions} />
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between" id="pagination">
        <p className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            id="prev-page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="w-9"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            id="next-page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
