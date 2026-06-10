import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Search, Download, X, ArrowDownLeft, ArrowUpRight,
  CheckCircle2, Clock, AlertCircle, Eye, RefreshCw,
  Flag, Star, Copy, CalendarDays, TrendingUp, TrendingDown, BarChart3, Info, Share2, Printer, History
} from 'lucide-react'
import { toast } from 'sonner'

const allTransactions = [
  { id: 'TXN001', date: '2026-03-11', account: 'Savings - 4521', description: 'Salary Credit - TechCorp', type: 'Credit', amount: 85000, status: 'Completed', reference: 'SAL/MAR/2026', category: 'Income' },
  { id: 'TXN002', date: '2026-03-10', account: 'Savings - 4521', description: 'Amazon Purchase', type: 'Debit', amount: 2499, status: 'Success', reference: 'AMZ-78234', category: 'Shopping' },
  { id: 'TXN003', date: '2026-03-10', account: 'Current - 7834', description: 'NEFT to Priya Sharma', type: 'Debit', amount: 25000, status: 'Success', reference: 'NEFT/2026/0892', category: 'Transfer' },
  { id: 'TXN004', date: '2026-03-09', account: 'Savings - 4521', description: 'Electricity Bill - BESCOM', type: 'Debit', amount: 1850, status: 'Processing', reference: 'BILL/ELEC/0345', category: 'Bills' },
  { id: 'TXN005', date: '2026-03-09', account: 'Savings - 4521', description: 'Flipkart Refund', type: 'Credit', amount: 799, status: 'Completed', reference: 'FK-REF-90123', category: 'Shopping' },
  { id: 'TXN006', date: '2026-03-08', account: 'Current - 7834', description: 'Office Rent Payment', type: 'Debit', amount: 35000, status: 'Success', reference: 'RENT/MAR/2026', category: 'Rent' },
  { id: 'TXN007', date: '2026-03-08', account: 'Savings - 4521', description: 'UPI - Swiggy Food', type: 'Debit', amount: 450, status: 'Success', reference: 'UPI/SWG/78234', category: 'Food' },
  { id: 'TXN008', date: '2026-03-07', account: 'Savings - 4521', description: 'Netflix Subscription', type: 'Debit', amount: 649, status: 'Success', reference: 'NFLX-SUB-03', category: 'Entertainment' },
  { id: 'TXN009', date: '2026-03-07', account: 'Savings - 4521', description: 'Interest Credit', type: 'Credit', amount: 1250, status: 'Completed', reference: 'INT/Q1/2026', category: 'Interest' },
  { id: 'TXN010', date: '2026-03-06', account: 'Current - 7834', description: 'Vendor Payment - SupplyCo', type: 'Debit', amount: 48500, status: 'Success', reference: 'VND/SUP/2026', category: 'Business' },
  { id: 'TXN011', date: '2026-03-06', account: 'Savings - 4521', description: 'Mobile Recharge - Airtel', type: 'Debit', amount: 599, status: 'Success', reference: 'RCH/AIR/78901', category: 'Bills' },
  { id: 'TXN012', date: '2026-03-05', account: 'Savings - 4521', description: 'Dividend Credit - HDFC MF', type: 'Credit', amount: 3200, status: 'Completed', reference: 'DIV/HDFC/Q1', category: 'Income' },
  { id: 'TXN013', date: '2026-03-05', account: 'Current - 7834', description: 'Insurance Premium - LIC', type: 'Debit', amount: 12500, status: 'Success', reference: 'INS/LIC/2026', category: 'Insurance' },
  { id: 'TXN014', date: '2026-03-04', account: 'Savings - 4521', description: 'ATM Withdrawal', type: 'Debit', amount: 10000, status: 'Success', reference: 'ATM/KMG/2026', category: 'Cash' },
  { id: 'TXN015', date: '2026-03-04', account: 'Savings - 4521', description: 'Cash Deposit', type: 'Credit', amount: 50000, status: 'Completed', reference: 'DEP/CASH/2026', category: 'Income' },
]

const statusConfig = {
  Completed: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Success:   { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Processing:{ icon: Clock,        className: 'bg-amber-50 text-amber-700 border-amber-200' },
  Failed:    { icon: AlertCircle,  className: 'bg-red-50 text-red-700 border-red-200' },
}

export default function Transactions() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm]     = useState(searchParams.get('search') || '')
  const [activeTab, setActiveTab]       = useState('all')
  const [quickFilter, setQuickFilter]   = useState('')
  const [currentPage, setCurrentPage]   = useState(1)
  const [fromDate, setFromDate]         = useState(null)
  const [toDate, setToDate]             = useState(null)
  const [calOpen, setCalOpen]           = useState(false)
  const [calTarget, setCalTarget]       = useState('from')
  const [selectedTxn, setSelectedTxn]   = useState(null)
  const [cmdOpen, setCmdOpen]           = useState(false)
  const itemsPerPage = 8

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  const filtered = allTransactions.filter(txn => {
    const matchSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase())
      || txn.id.toLowerCase().includes(searchTerm.toLowerCase())
      || txn.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTab = activeTab === 'all' || txn.type.toLowerCase() === activeTab
    const matchQuick = !quickFilter || txn.category.toLowerCase() === quickFilter.toLowerCase() || txn.status.toLowerCase() === quickFilter.toLowerCase()
    const matchFrom = !fromDate || txn.date >= fromDate.toISOString().slice(0, 10)
    const matchTo   = !toDate   || txn.date <= toDate.toISOString().slice(0, 10)
    return matchSearch && matchTab && matchQuick && matchFrom && matchTo
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalCredits = filtered.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0)
  const totalDebits  = filtered.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0)

  const handleExport = () => {
    const headers = ['ID', 'Date', 'Account', 'Description', 'Type', 'Amount', 'Status', 'Reference']
    const rows = filtered.map(t => [t.id, t.date, t.account, `"${t.description}"`, t.type, t.amount, t.status, t.reference])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `transactions_${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} transactions`)
  }

  const clearDates = () => { setFromDate(null); setToDate(null); setCurrentPage(1) }

  const openCalendar = (target) => { setCalTarget(target); setCalOpen(true) }

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCmdOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const TxnRow = ({ txn }) => {
    const StatusCfg = statusConfig[txn.status] || statusConfig.Processing
    const StatusIcon = StatusCfg.icon

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <TableRow 
            id={`txn-row-${txn.id}`} 
            className="cursor-pointer group hover:bg-muted/30 border-border/10 h-16"
            onClick={() => setSelectedTxn(txn)}
          >
            <TableCell className="pl-6 font-mono text-xs text-blue-600 font-bold w-[120px]">{txn.id}</TableCell>
            <TableCell className="w-[120px] text-muted-foreground text-xs">{txn.date}</TableCell>
            <TableCell>
               <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-foreground">{txn.description}</span>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0">{txn.category}</Badge>
                     <span className="text-[9px] text-muted-foreground">{txn.reference}</span>
                  </div>
               </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell font-mono text-[10px] text-muted-foreground">{txn.account}</TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-tighter ${StatusCfg.className} flex items-center w-fit mx-auto`}>
                <StatusIcon className="h-2.5 w-2.5 mr-1" />{txn.status}
              </Badge>
            </TableCell>
            <TableCell className={`text-sm font-black text-right pr-6 ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-red-500'}`}>
              {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
            </TableCell>
          </TableRow>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52" id={`ctx-menu-${txn.id}`}>
          <ContextMenuLabel className="text-xs text-muted-foreground">{txn.id}</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem id={`ctx-view-${txn.id}`} onSelect={() => setSelectedTxn(txn)}>
            <Eye className="mr-2 h-4 w-4" /> Deep Dive
          </ContextMenuItem>
          <ContextMenuItem id={`ctx-copy-${txn.id}`} onSelect={() => { navigator.clipboard.writeText(txn.reference); toast.success('Reference copied!') }}>
            <Copy className="mr-2 h-4 w-4" /> Copy Reference
          </ContextMenuItem>
          <ContextMenuItem id={`ctx-repeat-${txn.id}`} onSelect={() => toast.info('Opening repeat transfer...')}>
            <RefreshCw className="mr-2 h-4 w-4" /> Repeat Fund Transfer
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Metadata tagging</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => toast.success('Marked as Starred')}><Star className="mr-2 h-4 w-4 text-amber-500" /> Starred Priority</ContextMenuItem>
              <ContextMenuItem onSelect={() => toast.warning('Marked as Flagged')}><Flag className="mr-2 h-4 w-4 text-red-500" /> Audit Flag</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem id={`ctx-download-${txn.id}`} onSelect={() => toast.success('Encrypted Receipt downloaded')}>
            <Download className="mr-2 h-4 w-4" /> Download e-Receipt
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in" id="transactions-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">View, filter and export your transaction history</p>
        </div>
        <div className="flex gap-2">
          {/* Date Range Popover */}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button
                id="btn-date-range"
                variant="outline"
                className={`gap-2 ${(fromDate || toDate) ? 'border-blue-500 text-blue-600' : ''}`}
              >
                <CalendarDays className="h-4 w-4" />
                {fromDate || toDate
                  ? `${fromDate ? fromDate.toLocaleDateString('en-IN') : '...'} → ${toDate ? toDate.toLocaleDateString('en-IN') : '...'}`
                  : 'Date Range'}
                {(fromDate || toDate) && (
                  <X className="h-3 w-3 ml-1 hover:text-red-500" onClick={e => { e.stopPropagation(); clearDates() }} />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" id="date-range-popover">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button size="sm" variant={calTarget === 'from' ? 'default' : 'outline'} onClick={() => setCalTarget('from')} id="btn-cal-from">From Date</Button>
                  <Button size="sm" variant={calTarget === 'to' ? 'default' : 'outline'} onClick={() => setCalTarget('to')} id="btn-cal-to">To Date</Button>
                </div>
                <Calendar
                  mode="single"
                  id="txn-calendar"
                  selected={calTarget === 'from' ? fromDate : toDate}
                  onSelect={d => {
                    if (calTarget === 'from') { setFromDate(d); setCalTarget('to') }
                    else { setToDate(d); setCalOpen(false); setCurrentPage(1) }
                  }}
                  initialFocus
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>From: <strong>{fromDate?.toLocaleDateString('en-IN') || '—'}</strong></span>
                  <span>To: <strong>{toDate?.toLocaleDateString('en-IN') || '—'}</strong></span>
                </div>
                <Button size="sm" variant="ghost" className="w-full" onClick={clearDates} id="btn-clear-dates">Clear Dates</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleExport} id="btn-export-txn">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <TooltipProvider>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="txn-stats">
          {[
            { label: 'Total Transactions', value: filtered.length, icon: BarChart3, color: 'text-foreground' },
            { label: 'Total Credits', value: `₹${totalCredits.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-600' },
            { label: 'Total Debits', value: `₹${totalDebits.toLocaleString('en-IN')}`, icon: TrendingDown, color: 'text-red-600' },
            { label: 'Net Flow', value: `₹${(totalCredits - totalDebits).toLocaleString('en-IN')}`, icon: BarChart3, color: 'text-blue-600' },
          ].map((stat, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Card id={`txn-stat-${i}`} className="border-border/50 shadow-sm hover:shadow-lg transition-all cursor-default group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                      <p className={`text-lg font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent><p>{stat.label} across filtered transactions</p></TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Tabs + Filters */}
      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setCurrentPage(1) }} id="txn-tabs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList id="txn-tabs-list">
            <TabsTrigger value="all" id="tab-all-txn">All Transactions</TabsTrigger>
            <TabsTrigger value="credit" id="tab-credit-txn">
              <ArrowDownLeft className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> Credits
            </TabsTrigger>
            <TabsTrigger value="debit" id="tab-debit-txn">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1.5 text-red-500" /> Debits
            </TabsTrigger>
          </TabsList>

          {/* Quick Filter Chips */}
          <ToggleGroup type="single" value={quickFilter} onValueChange={v => { setQuickFilter(v); setCurrentPage(1) }} id="txn-quick-filters">
            {['Income', 'Shopping', 'Bills', 'Transfer', 'Food'].map(cat => (
              <ToggleGroupItem key={cat} value={cat} id={`filter-${cat.toLowerCase()}`} className="text-xs h-8 px-3">
                {cat}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Search + Select Filters */}
        <Card className="mt-4 border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center" id="txn-filters">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="txn-search"
                  placeholder="Search by description, ID or reference…"
                  className="pl-9 h-9"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                />
              </div>
              <Select onValueChange={v => { setQuickFilter(v === 'all' ? '' : v); setCurrentPage(1) }}>
                <SelectTrigger id="txn-category-filter" className="w-40 h-9"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {['Income', 'Shopping', 'Bills', 'Transfer', 'Food', 'Entertainment', 'Business', 'Insurance', 'Cash', 'Interest'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={v => { setQuickFilter(v === 'all' ? '' : v); setCurrentPage(1) }}>
                <SelectTrigger id="txn-status-filter" className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || quickFilter || fromDate || toDate) && (
                <Button variant="ghost" size="sm" id="btn-clear-filters"
                  onClick={() => { setSearchTerm(''); setQuickFilter(''); clearDates() }}>
                  <X className="h-4 w-4 mr-1" /> Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {['all', 'credit', 'debit'].map(tab => (
          <TabsContent key={tab} value={tab} id={`tab-content-${tab}`} className="mt-0">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <Table id={`table-${tab}`}>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40 border-none">
                    <TableHead className="pl-6 text-[10px] uppercase tracking-widest font-black">Ref ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-black">Date</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-black">Narration</TableHead>
                    <TableHead className="hidden lg:table-cell text-[10px] uppercase tracking-widest font-black">Account</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-black text-center">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-black text-right pr-6">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-4 opacity-20" />
                          <p className="text-sm font-bold italic">No specialized transaction history found.</p>
                          <Button variant="link" onClick={() => { setSearchTerm(''); setQuickFilter('') }} className="text-blue-600 mt-2 font-bold">Flush Filters</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginated.map(txn => <TxnRow key={txn.id} txn={txn} />)}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between" id="txn-pagination">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious id="btn-prev-page" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PaginationItem key={p}>
                  <PaginationLink id={`btn-page-${p}`} isActive={currentPage === p} onClick={() => setCurrentPage(p)} className="cursor-pointer">{p}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext id="btn-next-page" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 text-center animate-pulse">
        💡 HINT: PRESS <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/50 font-sans">CTRL + J</kbd> FOR GLOBAL JUMP SEARCH
      </p>

      {/* Detail Sheet */}
      <Sheet open={!!selectedTxn} onOpenChange={(v) => !v && setSelectedTxn(null)}>
        <SheetContent className="sm:max-w-md border-l-border/50 p-0 shadow-2xl">
          {selectedTxn && (
            <div className="h-full flex flex-col">
              <div className={`p-8 ${selectedTxn.type === 'Credit' ? 'bg-emerald-500/10' : 'bg-red-500/10'} border-b border-border/10`}>
                <Badge className={`mb-4 ${selectedTxn.type === 'Credit' ? 'bg-emerald-500' : 'bg-red-500'}`}>{selectedTxn.type}</Badge>
                <h2 className="text-3xl font-black tracking-tighter italic mb-1">₹{selectedTxn.amount.toLocaleString()}</h2>
                <p className="text-sm font-bold text-muted-foreground">{selectedTxn.description}</p>
              </div>
              <ScrollArea className="flex-1 p-8">
                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Post Date</p>
                         <p className="text-sm font-bold">{selectedTxn.date}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</p>
                         <p className="text-sm font-black italic text-blue-600">{selectedTxn.status}</p>
                      </div>
                   </div>
                   <Separator />
                   <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                         <p className="text-xs text-muted-foreground">Internal Reference</p>
                         <div className="flex items-center gap-2">
                            <code className="text-[11px] font-bold bg-muted px-2 py-0.5 rounded">{selectedTxn.reference}</code>
                            <Copy className="h-3 w-3 cursor-pointer opacity-0 group-hover:opacity-100" onClick={() => toast.success('Copied')} />
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-xs text-muted-foreground">Target Account</p>
                         <p className="text-sm font-mono font-bold">{selectedTxn.account}</p>
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-xs text-muted-foreground">Tax Classification</p>
                         <Badge variant="outline" className="font-bold text-[10px]">NON-TAXABLE</Badge>
                      </div>
                   </div>
                   <Separator />
                   <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border/60">
                      <div className="flex items-center gap-3 text-blue-600 mb-2">
                         <Info className="h-4 w-4" />
                         <p className="text-xs font-black uppercase tracking-widest">Audit Logs</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                         Transaction initiated via Internet Banking Portal (IP: 192.168.1.104). Verified by MFA dynamic signature token #9921. Settlements processed via RTGS Batch G1.
                      </p>
                   </div>
                </div>
              </ScrollArea>
              <SheetFooter className="p-6 bg-muted/10 border-t flex items-center gap-2 sm:justify-between">
                 <Button variant="outline" className="flex-1 font-bold"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
                 <Button className="flex-1 font-bold"><Printer className="h-4 w-4 mr-2" /> PDF Receipt</Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Command Jump */}
      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Type a description or ID to jump..." />
        <CommandList className="max-h-[300px]">
          <CommandEmpty>No transactions found for this search.</CommandEmpty>
          <CommandGroup heading="Recent Activity">
            {allTransactions.slice(0, 10).map((t) => (
              <CommandItem 
                key={t.id} 
                className="cursor-pointer"
                onSelect={() => { setSelectedTxn(t); setCmdOpen(false) }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{t.description}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{t.id} · {t.date}</span>
                  </div>
                  <span className={`text-xs font-black ${t.type === 'Credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
