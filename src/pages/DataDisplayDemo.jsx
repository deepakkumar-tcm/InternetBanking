import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, AlertCircle,
  Download, Filter, Search, TrendingUp, TrendingDown, LineChart
} from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'

const transactions = [
  { id: 'TXN001', date: '12 Mar 2024', desc: 'Salary Credit', type: 'credit', amount: 85000, status: 'Success', category: 'Income', account: '••4521' },
  { id: 'TXN002', date: '11 Mar 2024', desc: 'Amazon Purchase', type: 'debit', amount: 2299, status: 'Success', category: 'Shopping', account: '••4521' },
  { id: 'TXN003', date: '10 Mar 2024', desc: 'Home Loan EMI', type: 'debit', amount: 22000, status: 'Success', category: 'Loan', account: '••8832' },
  { id: 'TXN004', date: '10 Mar 2024', desc: 'Transfer to Priya', type: 'debit', amount: 15000, status: 'Success', category: 'Transfer', account: '••4521' },
  { id: 'TXN005', date: '09 Mar 2024', desc: 'Electricity Bill', type: 'debit', amount: 1840, status: 'Pending', category: 'Utilities', account: '••4521' },
  { id: 'TXN006', date: '08 Mar 2024', desc: 'Swiggy Order', type: 'debit', amount: 340, status: 'Success', category: 'Food', account: '••4521' },
  { id: 'TXN007', date: '07 Mar 2024', desc: 'Dividend Income', type: 'credit', amount: 3200, status: 'Success', category: 'Investment', account: '••3312' },
  { id: 'TXN008', date: '06 Mar 2024', desc: 'Netflix Subscription', type: 'debit', amount: 649, status: 'Success', category: 'Entertainment', account: '••4521' },
  { id: 'TXN009', date: '05 Mar 2024', desc: 'Petrol – HP Pump', type: 'debit', amount: 2000, status: 'Failed', category: 'Fuel', account: '••4521' },
  { id: 'TXN010', date: '04 Mar 2024', desc: 'Rent Collection', type: 'credit', amount: 25000, status: 'Success', category: 'Income', account: '••8832' },
  { id: 'TXN011', date: '03 Mar 2024', desc: 'Car Insurance', type: 'debit', amount: 8400, status: 'Success', category: 'Insurance', account: '••4521' },
  { id: 'TXN012', date: '02 Mar 2024', desc: 'SIP Investment', type: 'debit', amount: 10000, status: 'Success', category: 'Investment', account: '••4521' },
  { id: 'TXN013', date: '01 Mar 2024', desc: 'Interest Credit', type: 'credit', amount: 1250, status: 'Success', category: 'Interest', account: '••3312' },
  { id: 'TXN014', date: '29 Feb 2024', desc: 'Airtel Recharge', type: 'debit', amount: 299, status: 'Success', category: 'Utilities', account: '••4521' },
  { id: 'TXN015', date: '28 Feb 2024', desc: 'Flight Booking', type: 'debit', amount: 12450, status: 'Pending', category: 'Travel', account: '••4521' },
]

const accounts = [
  { id: 'ACC001', type: 'Savings', number: '•••• 4521', balance: 152340, limit: 500000, branch: 'MG Road, Bangalore', ifsc: 'SBIN0012345', status: 'Active' },
  { id: 'ACC002', type: 'Current', number: '•••• 8832', balance: 300000, limit: 1000000, branch: 'Koramangala, Bangalore', ifsc: 'SBIN0054321', status: 'Active' },
  { id: 'ACC003', type: 'Fixed Deposit', number: '•••• 3312', balance: 500000, limit: 500000, branch: 'Online', ifsc: 'SBIN0012345', status: 'Locked' },
]

const statusConfig = {
  Success: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2, iconClass: 'text-emerald-600' },
  Pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, iconClass: 'text-amber-600' },
  Failed: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, iconClass: 'text-red-600' },
}

export default function DataDisplayDemo() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 8

  useEffect(() => {
    console.log('[ROUTE] Current path:', window.location.pathname)
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

  const filtered = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter || t.status.toLowerCase() === filter
    const matchesSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)

  return (
    <div id="data-display-page" className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Data Display</h1>
          <p className="text-muted-foreground mt-1.5">Tables, pagination, scroll areas, and data visualization</p>
        </div>
        <Button id="btn-export-data" variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* ─── SUMMARY CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="summary-cards">
        {[
          { label: 'Total Transactions', value: transactions.length, color: 'text-foreground', bg: 'bg-muted/40' },
          { label: 'Total Credit', value: `₹${(totalCredit / 1000).toFixed(1)}K`, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Total Debit', value: `₹${(totalDebit / 1000).toFixed(1)}K`, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Net Balance', value: `₹${((totalCredit - totalDebit) / 1000).toFixed(1)}K`, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <Card key={i} id={`summary-card-${i}`} className={`border shadow-sm ${item.bg}`}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── TRANSACTION TRENDS CHART ─── */}
      <section id="section-txn-trends">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><LineChart className="h-5 w-5" /> Transaction Trends</h2>
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Monthly Spending Analysis</CardTitle>
            <CardDescription>Visualizing your cash flow over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ChartContainer
              config={{ spending: { label: "Spending (₹)", color: "hsl(var(--primary))" } }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Apr', spending: 42000 },
                  { month: 'May', spending: 35000 },
                  { month: 'Jun', spending: 51000 },
                  { month: 'Jul', spending: 48000 },
                  { month: 'Aug', spending: 54000 },
                  { month: 'Sep', spending: 43000 },
                  { month: 'Oct', spending: 59000 },
                  { month: 'Nov', spending: 62000 },
                  { month: 'Dec', spending: 48000 },
                  { month: 'Jan', spending: 31000 },
                  { month: 'Feb', spending: 52000 },
                  { month: 'Mar', spending: 45000 },
                ]}>
                  <defs>
                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Area type="monotone" dataKey="spending" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSpending)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* ─── ACCOUNTS TABLE ─── */}
      <section id="section-accounts-table">
        <h2 className="text-xl font-bold mb-4">Account Summary</h2>
        <Card className="border shadow-sm">
          <Table id="accounts-table">
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Account No.</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>IFSC</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(acct => (
                <TableRow key={acct.id} id={`account-row-${acct.id}`}>
                  <TableCell className="font-mono text-sm">{acct.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{acct.type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{acct.number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{acct.branch}</TableCell>
                  <TableCell className="font-mono text-xs">{acct.ifsc}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{acct.balance.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Badge className={acct.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}>
                      {acct.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* ─── TRANSACTIONS DATA TABLE ─── */}
      <section id="section-transactions-data-table">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="txn-search-input"
                placeholder="Search transactions..."
                className="pl-9 w-52 h-9"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <Select value={filter} onValueChange={v => { setFilter(v); setPage(1) }}>
              <SelectTrigger id="txn-filter-select" className="w-36 h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="credit">Credits</SelectItem>
                <SelectItem value="debit">Debits</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border shadow-sm" id="transactions-card">
          {loading ? (
            <div className="p-6 space-y-3" id="table-skeleton">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                </div>
              ))}
            </div>
          ) : (
            <Table id="transactions-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Txn ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : paginated.map(txn => {
                  const Status = statusConfig[txn.status]
                  return (
                    <TableRow key={txn.id} id={`txn-row-${txn.id}`} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs text-muted-foreground">{txn.id}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{txn.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {txn.type === 'credit'
                              ? <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
                              : <ArrowUpRight className="h-3.5 w-3.5 text-red-600" />
                            }
                          </div>
                          <span className="text-sm font-medium">{txn.desc}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{txn.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{txn.account}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border ${Status.color}`}>
                          <Status.icon className={`h-3 w-3 mr-1 ${Status.iconClass}`} />
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* ─── PAGINATION ─── */}
        {!loading && filtered.length > itemsPerPage && (
          <div className="mt-4 flex items-center justify-between" id="pagination-container">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} transactions
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious id="btn-page-prev" onClick={() => setPage(p => Math.max(1, p - 1))} className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink id={`btn-page-${i + 1}`} onClick={() => setPage(i + 1)} isActive={page === i + 1} className="cursor-pointer">
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext id="btn-page-next" onClick={() => setPage(p => Math.min(totalPages, p + 1))} className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      {/* ─── SCROLL AREA ─── */}
      <section id="section-scroll-area">
        <h2 className="text-xl font-bold mb-4">Scroll Area</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity Feed</CardTitle>
              <CardDescription>Last 30 account activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea id="activity-scroll-area" className="h-72 rounded-xl border p-3">
                <div className="space-y-3">
                  {transactions.concat(transactions).map((txn, i) => (
                    <div key={`${txn.id}-${i}`} id={`scroll-item-${i}`} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${txn.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {txn.type === 'credit'
                          ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                          : <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{txn.desc}</p>
                        <p className="text-xs text-muted-foreground">{txn.date}</p>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Separator & Badges</CardTitle>
              <CardDescription>Category breakdown with separators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3" id="category-breakdown">
              {[
                { label: 'Income', amount: 114450, pct: 100, color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
                { label: 'Loan EMI', amount: 22000, pct: 19, color: 'bg-red-400', badge: 'bg-red-100 text-red-800' },
                { label: 'Shopping', amount: 2299, pct: 2, color: 'bg-violet-400', badge: 'bg-violet-100 text-violet-800' },
                { label: 'Utilities', amount: 2139, pct: 1.9, color: 'bg-amber-400', badge: 'bg-amber-100 text-amber-800' },
                { label: 'Food', amount: 340, pct: 0.3, color: 'bg-orange-400', badge: 'bg-orange-100 text-orange-800' },
              ].map((item, i, arr) => (
                <div key={item.label}>
                  <div id={`category-${i}`} className="flex items-center gap-3">
                    <Badge className={`${item.badge} border-0 text-xs w-24 justify-center`}>{item.label}</Badge>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                    <span className="font-semibold text-sm w-20 text-right">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── PROGRESS / KPI SECTION ─── */}
      <section id="section-kpi">
        <h2 className="text-xl font-bold mb-4">KPI Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="kpi-cards">
          {[
            { label: 'Credit Score', value: 782, max: 900, pct: 87, color: 'bg-emerald-500', note: 'Excellent' },
            { label: 'KYC Completion', value: 9, max: 10, pct: 90, color: 'bg-blue-500', note: '1 step pending' },
            { label: 'Savings Target (Annual)', value: 120000, max: 200000, pct: 60, color: 'bg-violet-500', note: '₹1.2L of ₹2L' },
            { label: 'Investment Portfolio Health', value: 78, max: 100, pct: 78, color: 'bg-amber-500', note: 'Good diversification' },
          ].map((kpi, i) => (
            <Card key={i} id={`kpi-card-${i}`} className="border shadow-sm">
              <CardContent className="pt-5 pb-5 space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">{kpi.label}</p>
                  <Badge variant="outline" className="text-xs">{kpi.note}</Badge>
                </div>
                <Progress value={kpi.pct} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{kpi.pct}% achieved</span>
                  <span className={`font-semibold ${kpi.color.replace('bg-', 'text-').replace('-500', '-600')}`}>{kpi.value.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
