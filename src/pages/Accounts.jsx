import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AccountCard from '@/components/AccountCard'
import { Plus, Download, Filter, Loader2, ListChecks, History, Home, ChevronsUpDown, Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

const accountsData = [
  { id: 'acc-1', type: 'savings', label: 'Savings Account', number: 'XXXX XXXX XXXX 4521', balance: 285230.50, currency: 'INR', branch: 'Koramangala, Bangalore', ifsc: 'SBIN0001234', lastActivity: '2 hours ago', status: 'Active', limit: 1000000, interestRate: '3.5% p.a.', opened: 'Jan 2019' },
  { id: 'acc-2', type: 'current', label: 'Current Account', number: 'XXXX XXXX XXXX 7834', balance: 142500.00, currency: 'INR', branch: 'MG Road, Bangalore', ifsc: 'SBIN0005678', lastActivity: '1 day ago', status: 'Active', limit: 5000000, interestRate: '0% p.a.', opened: 'Mar 2021' },
  { id: 'acc-3', type: 'fixed', label: 'Fixed Deposit', number: 'XXXX XXXX XXXX 9012', balance: 500000.00, currency: 'INR', branch: 'Koramangala, Bangalore', ifsc: 'SBIN0001234', lastActivity: '30 days ago', status: 'Locked', limit: 500000, interestRate: '7.5% p.a.', opened: 'Oct 2023' },
]
const accountSummary = [
  { label: 'Total Assets', value: '₹9,27,730.50', change: '+₹85,000', pct: 78 },
  { label: 'Total Liabilities', value: '₹3,45,000.00', change: '-₹12,500', pct: 34 },
  { label: 'Net Worth', value: '₹5,82,730.50', change: '+₹97,500', pct: 62 },
]
const faqs = [
  { q: 'How do I open a new account?', a: 'Click "Open New Account" above, then choose a type (Savings / Current / Demat) and fill in your initial deposit amount. Our agent will contact you within 2 business days.' },
  { q: 'How to transfer funds between accounts?', a: 'Navigate to Transfer Money in the sidebar, select source and destination accounts, enter the amount and OTP to confirm.' },
  { q: 'What is the minimum balance for Savings?', a: 'Our Savings Supreme account requires a minimum average quarterly balance of ₹10,000.' },
  { q: 'How to freeze or close an account?', a: 'You can freeze an account temporarily via Account Options → Freeze. For closure, contact your branch or raise a request through Support.' },
  { q: 'When is interest credited?', a: 'Savings interest is credited quarterly. Fixed Deposit interest is credited as per the payout option chosen at the time of opening.' },
]

export default function Accounts() {
  const navigate = useNavigate()
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMiniStatementOpen, setIsMiniStatementOpen] = useState(false)
  const [activeAccount, setActiveAccount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState({})
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [minBalance, setMinBalance] = useState('')
  const [maxBalance, setMaxBalance] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({ status: 'all', type: 'all', min: '', max: '' })

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  const filteredAccounts = accountsData.filter(acc => {
    const matchStatus = appliedFilters.status === 'all' || acc.status.toLowerCase() === appliedFilters.status
    const matchType = appliedFilters.type === 'all' || acc.type === appliedFilters.type
    const matchMin = !appliedFilters.min || acc.balance >= parseFloat(appliedFilters.min)
    const matchMax = !appliedFilters.max || acc.balance <= parseFloat(appliedFilters.max)
    return matchStatus && matchType && matchMin && matchMax
  })

  const handleExport = () => {
    const headers = ['Account', 'Number', 'Type', 'Balance (INR)', 'Branch', 'IFSC', 'Status']
    const rows = filteredAccounts.map(acc => [acc.label, acc.number, acc.type, acc.balance.toFixed(2), acc.branch, acc.ifsc, acc.status])
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a'); link.href = url; link.download = 'account_statement.csv'; link.click()
    URL.revokeObjectURL(url)
    toast.success('Account statement downloaded!')
  }

  const handleOpenAccount = (e) => {
    e.preventDefault(); setLoading(true)
    setTimeout(() => { setLoading(false); setIsNewAccountOpen(false); toast.success('Account Opening Request Submitted', { description: 'Reference: REQ-BNK-92834' }) }, 2000)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({ status: statusFilter, type: typeFilter, min: minBalance, max: maxBalance })
    setIsFilterOpen(false); toast.success('Filters applied')
  }

  const handleResetFilters = () => {
    setStatusFilter('all'); setTypeFilter('all'); setMinBalance(''); setMaxBalance('')
    setAppliedFilters({ status: 'all', type: 'all', min: '', max: '' })
    setIsFilterOpen(false); toast.info('Filters reset')
  }

  return (
    <div className="space-y-8 animate-fade-in" id="accounts-page">
      {/* Breadcrumb */}
      <Breadcrumb id="accounts-breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>My Accounts</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar id="accounts-user-avatar">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">RK</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Accounts</h2>
            <p className="text-sm text-muted-foreground font-medium">Rajesh Kumar · Premium Plus</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExport} id="btn-export-accounts"><Download className="h-4 w-4 mr-2" />Export</Button>
            </TooltipTrigger>
            <TooltipContent>Download all accounts as CSV</TooltipContent>
          </Tooltip>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} id="btn-filter-accounts">
            <Filter className="h-4 w-4 mr-2" />Filter
            {(appliedFilters.status !== 'all' || appliedFilters.type !== 'all' || appliedFilters.min || appliedFilters.max) && (
              <Badge className="ml-2 h-4 w-4 p-0 text-[9px] bg-blue-600 border-none flex items-center justify-center rounded-full">!</Badge>
            )}
          </Button>
          <Button onClick={() => setIsNewAccountOpen(true)} id="btn-open-new-account" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />Open New Account
          </Button>
        </div>
      </div>

      {/* Summary Cards with Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="account-summary">
        {accountSummary.map((item, i) => (
          <Card key={i} className="border shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-black tracking-tighter">{item.value}</p>
              <Progress value={item.pct} className="h-1.5" />
              <p className="text-xs font-semibold text-emerald-600">{item.change} this cycle</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="account-cards">
        {filteredAccounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            id={account.id}
            onViewStatement={() => { toast.info(`Fetching statement for ${account.label}`); navigate(`/transactions?account=${account.number}`) }}
            onMiniStatement={() => { setActiveAccount(account); setIsMiniStatementOpen(true) }}
            onMore={() => toast.info(`Options for ${account.label} accessed.`)}
          />
        ))}
        {filteredAccounts.length === 0 && (
          <div className="col-span-3 py-16 text-center text-muted-foreground">
            <p className="font-medium">No accounts match your current filters.</p>
            <Button variant="link" onClick={handleResetFilters} className="mt-2 text-blue-600">Reset Filters</Button>
          </div>
        )}
      </div>

      {/* Collapsible Account Details Table */}
      <Collapsible id="collapsible-account-details" open={detailsOpen.table} onOpenChange={v => setDetailsOpen(p => ({ ...p, table: v }))}>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b bg-muted/5">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Asset Inventory Details</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Click to expand the full account table</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" id="btn-toggle-account-table">
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                {detailsOpen.table ? 'Collapse' : 'Expand'}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent id="account-table-content">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest">Account</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Number</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Type</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Interest Rate</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Balance</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map(acc => (
                  <TableRow key={acc.id} id={`account-row-${acc.id}`} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-6 font-bold text-sm">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-help underline decoration-dotted decoration-muted-foreground">{acc.label}</span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64" id={`hovercard-${acc.id}`}>
                          <div className="space-y-2">
                            <p className="font-bold text-sm">{acc.label}</p>
                            <Separator />
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <span className="text-muted-foreground">Branch:</span><span className="font-medium">{acc.branch}</span>
                              <span className="text-muted-foreground">IFSC:</span><span className="font-mono font-medium">{acc.ifsc}</span>
                              <span className="text-muted-foreground">Opened:</span><span className="font-medium">{acc.opened}</span>
                              <span className="text-muted-foreground">Interest:</span><span className="font-medium text-emerald-600">{acc.interestRate}</span>
                              <span className="text-muted-foreground">Last Active:</span><span className="font-medium">{acc.lastActivity}</span>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{acc.number}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize text-[10px]">{acc.type}</Badge></TableCell>
                    <TableCell className="text-emerald-600 font-semibold text-sm">{acc.interestRate}</TableCell>
                    <TableCell className="text-right font-black">₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={acc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                        {acc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" id={`btn-view-registry-${acc.id}`} className="text-blue-600 text-xs font-bold hover:bg-blue-50">View Registry</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent id={`alert-registry-${acc.id}`}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Open Full Registry for {acc.label}?</AlertDialogTitle>
                            <AlertDialogDescription>This will navigate you to the Transactions page filtered for account {acc.number}.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel id={`btn-cancel-registry-${acc.id}`}>Cancel</AlertDialogCancel>
                            <AlertDialogAction id={`btn-confirm-registry-${acc.id}`} onClick={() => navigate(`/transactions?account=${acc.number}`)}>Go to Registry</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* FAQ Accordion */}
      <div id="section-account-faq">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" /> Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="border rounded-xl divide-y" id="accounts-faq-accordion">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="px-4 border-0" id={`faq-item-${i}`}>
              <AccordionTrigger id={`faq-trigger-${i}`} className="text-sm font-medium hover:no-underline py-4">{faq.q}</AccordionTrigger>
              <AccordionContent id={`faq-content-${i}`} className="text-sm text-muted-foreground pb-4">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Dialogs (same as before) */}
      <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Open Premier Account</DialogTitle>
            <DialogDescription>Unlock exclusive benefits and higher limits.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOpenAccount} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Account Type</Label>
              <Select required>
                <SelectTrigger id="new-account-type"><SelectValue placeholder="Choose Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings Supreme</SelectItem>
                  <SelectItem value="current">Business Elite</SelectItem>
                  <SelectItem value="demat">Wealth Demat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Initial Deposit</Label>
              <Input id="new-account-deposit" type="number" placeholder="Min ₹25,000" className="h-11" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsNewAccountOpen(false)}>Cancel</Button>
              <Button type="submit" id="btn-submit-new-account" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing…</> : 'Initiate Request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Filter Accounts</DialogTitle>
            <DialogDescription>Narrow down accounts by status, type or balance range.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="filter-status"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Account Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="filter-type"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="fixed">Fixed Deposit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Min Balance (₹)</Label>
                <Input id="filter-min-balance" placeholder="Min" type="number" value={minBalance} onChange={e => setMinBalance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Max Balance (₹)</Label>
                <Input id="filter-max-balance" placeholder="Max" type="number" value={maxBalance} onChange={e => setMaxBalance(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleResetFilters} id="btn-reset-account-filters">Reset</Button>
              <Button className="flex-1" onClick={handleApplyFilters} id="btn-apply-account-filters">Apply Filters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMiniStatementOpen} onOpenChange={setIsMiniStatementOpen}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-blue-400">Mini Statement</DialogTitle>
            <DialogDescription className="text-zinc-500 text-[10px] uppercase tracking-widest">{activeAccount?.label}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} id={`mini-stmt-row-${i}`} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {i % 2 === 0 ? <TrendingUp className="h-4 w-4" /> : <History className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold">Transaction Ref #BNK-{8273 + i}</p>
                    <p className="text-[10px] text-zinc-500">11 MAR 2026 · 09:23 AM</p>
                  </div>
                </div>
                <p className={`text-sm font-black ${i % 2 === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {i % 2 === 0 ? '+' : '-'} ₹{((i * 1234.56) % 5000).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter className="border-t border-zinc-800 pt-4">
            <Button variant="ghost" onClick={() => setIsMiniStatementOpen(false)} className="text-zinc-400 hover:text-white">Close</Button>
            <Button id="btn-download-mini-stmt" className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => { toast.success('Mini statement downloaded!'); setIsMiniStatementOpen(false) }}>
              Download Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
