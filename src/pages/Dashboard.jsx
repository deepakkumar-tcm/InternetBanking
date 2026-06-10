import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, ArrowLeftRight, CreditCard, PiggyBank, SendHorizontal, Receipt, QrCode, Plus, Camera, Loader2, Search, Bell, Settings, LogOut, LayoutDashboard, Landmark, Users, TrendingUp, Info, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut, CommandSeparator } from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import StatsCard from '@/components/StatsCard'
import TransactionTable from '@/components/TransactionTable'
import ActivityFeed from '@/components/ActivityFeed'
import NotificationPanel from '@/components/NotificationPanel'
import { toast } from 'sonner'

const recentTransactions = [
  { id: 'TXN001', date: '2026-03-11', account: 'Savings - 4521', description: 'Salary Credit - TechCorp', type: 'Credit', amount: 85000, status: 'Completed', reference: 'SAL/MAR/2026' },
  { id: 'TXN002', date: '2026-03-10', account: 'Savings - 4521', description: 'Amazon Purchase', type: 'Debit', amount: 2499, status: 'Success', reference: 'AMZ-78234' },
  { id: 'TXN003', date: '2026-03-10', account: 'Current - 7834', description: 'NEFT to Priya Sharma', type: 'Debit', amount: 25000, status: 'Success', reference: 'NEFT/2026/0892' },
  { id: 'TXN004', date: '2026-03-09', account: 'Savings - 4521', description: 'Electricity Bill - BESCOM', type: 'Debit', amount: 1850, status: 'Processing', reference: 'BILL/ELEC/0345' },
  { id: 'TXN005', date: '2026-03-09', account: 'Savings - 4521', description: 'Flipkart Refund', type: 'Credit', amount: 799, status: 'Completed', reference: 'FK-REF-90123' },
]

const spendingCategories = [
  { category: 'Shopping',        amount: 12450, percentage: 32, color: 'bg-blue-500' },
  { category: 'Bills & Utilities', amount: 8900, percentage: 23, color: 'bg-emerald-500' },
  { category: 'Food & Dining',  amount: 6700, percentage: 17, color: 'bg-orange-500' },
  { category: 'Transport',      amount: 4200, percentage: 11, color: 'bg-purple-500' },
  { category: 'Entertainment',  amount: 3100, percentage: 8,  color: 'bg-pink-500' },
  { category: 'Others',         amount: 3650, percentage: 9,  color: 'bg-gray-400' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [isScanOpen, setIsScanOpen] = useState(false)
  const [isFDOpen, setIsFDOpen] = useState(false)
  const [fdLoading, setFdLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCmdOpen, setIsCmdOpen] = useState(false)

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    const timer = setTimeout(() => setIsLoading(false), 800)
    
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCmdOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', down)
    }
  }, [])

  const handleOpenFD = (e) => {
    e.preventDefault()
    setFdLoading(true)
    setTimeout(() => {
      setFdLoading(false)
      setIsFDOpen(false)
      toast.success('Fixed Deposit Created', {
        description: 'Your new FD account has been provisioned successfully.'
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in py-6">
        <Skeleton className="h-48 w-full rounded-2xl" id="skeleton-banner" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-page">
      {/* Command Shortcut Info */}
      <div className="flex items-center justify-between">
        <div className="hidden md:block">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded w-fit">
            Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 italic">⌘ K</kbd> to search
          </p>
        </div>
        <div className="flex gap-2">
           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsCmdOpen(true)}>
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search Anything</TooltipContent>
              </Tooltip>
           </TooltipProvider>
        </div>
      </div>

      {/* Credit Limit Pending Request Alert Banner */}
      {(() => {
        // Read pending requests written by CreditLimitIncrease page (localStorage)
        const pending = JSON.parse(localStorage.getItem('clr_pending_requests') || '[]')
        if (!pending.length) return null
        return (
          <div
            id="dashboard-clr-banner"
            className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-4 py-3"
          >
            <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Credit Limit Increase Pending
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 truncate">
                Request {pending[0].id} — {pending[0].cardMasked} · Submitted {new Date(pending[0].requestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 flex-shrink-0"
              onClick={() => navigate('/credit-limit')}
              id="btn-dashboard-view-clr"
            >
              View Status
            </Button>
          </div>
        )
      })()}

      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 px-8 py-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight underline decoration-blue-400/30 decoration-4 underline-offset-8">Welcome, Rajesh! 👋</h2>
            <p className="text-blue-100/80 font-medium text-sm">Automated wealth summary for fiscal year 2026.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <Button variant="secondary" onClick={() => navigate('/transfer')} className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md h-12 px-6 font-bold shadow-lg">
              <SendHorizontal className="h-4 w-4 mr-2" /> Quick Transfer
            </Button>
            <Button variant="secondary" onClick={() => setIsScanOpen(true)} className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md h-12 px-6 font-bold shadow-lg">
              <QrCode className="h-4 w-4 mr-2" /> Scan & Pay
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-cards">
        <StatsCard id="stat-total-balance" title="Total Liquidity" value="₹4,85,230.50" change="+12.5%" changeType="positive" icon={Wallet} color="blue" />
        <StatsCard id="stat-monthly-income" title="Monthly Inflow" value="₹1,25,000" change="+8.2%" changeType="positive" icon={PiggyBank} color="green" />
        <StatsCard id="stat-monthly-spending" title="Monthly Outflow" value="₹39,000" change="-3.1%" changeType="negative" icon={CreditCard} color="purple" />
        <StatsCard id="stat-transactions" title="Execution Count" value="156" change="+18.7%" changeType="positive" icon={ArrowLeftRight} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-border/10 bg-muted/5">
              <CardTitle className="text-lg font-bold uppercase tracking-tight">Recent Ledger Entries</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')} className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-50">View All Records</Button>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionTable transactions={recentTransactions} compact />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold uppercase tracking-tight text-muted-foreground/60">Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6" id="spending-analytics">
                {spendingCategories.map((cat) => (
                  <div key={cat.category} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{cat.category}</span>
                      <span className="text-sm font-black">₹{cat.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden ring-1 ring-border/20">
                      <div className={`h-full rounded-full ${cat.color} transition-all duration-1000 shadow-sm`} style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
                <Separator className="bg-border/50" />
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-black uppercase tracking-widest text-muted-foreground italic">Aggregate Monthly Debt</span>
                  <span className="text-2xl font-black tracking-tight">₹39,000.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Command Center</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4" id="quick-actions">
                <Button variant="outline" onClick={() => navigate('/transfer')} className="h-28 flex-col gap-3 hover:bg-blue-50 hover:border-blue-300 transition-all border-border/50 group rounded-2xl">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform"><SendHorizontal className="h-6 w-6 text-blue-600" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Transfers</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/bill-payments')} className="h-28 flex-col gap-3 hover:bg-emerald-50 hover:border-emerald-300 transition-all border-border/50 group rounded-2xl">
                   <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform"><Receipt className="h-6 w-6 text-emerald-600" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Payments</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/cards')} className="h-28 flex-col gap-3 hover:bg-purple-50 hover:border-purple-300 transition-all border-border/50 group rounded-2xl">
                   <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform"><CreditCard className="h-6 w-6 text-purple-600" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">My Cards</span>
                </Button>
                <Button variant="outline" onClick={() => setIsFDOpen(true)} className="h-28 flex-col gap-3 hover:bg-orange-50 hover:border-orange-300 transition-all border-border/50 group rounded-2xl">
                   <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="h-6 w-6 text-orange-600" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">New Deposit</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 bg-muted/5 border-b border-border/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Live Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <NotificationPanel />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/10 bg-muted/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Audit Log</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/support')} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-50">See All</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <ActivityFeed />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scan & Pay Dialog */}
      <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Fast-Scan Technology</DialogTitle>
            <DialogDescription className="text-zinc-400">Position the merchant QR code within the frame.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-10 gap-6">
             <div className="relative h-64 w-64 border-2 border-dashed border-blue-500 rounded-3xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                <Camera className="h-16 w-16 text-blue-500 animate-bounce" />
                <div className="absolute top-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
             </div>
             <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">Initializing Neural Engine...</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => { setIsScanOpen(false); toast.info('Scan canceled'); }} className="border-zinc-800 hover:bg-zinc-900 font-bold">Abort Session</Button>
            <Button onClick={() => { setIsScanOpen(false); toast.success('Merchant Identified: STARBUCKS #401', { description: 'Redirecting to secure payment portal...' }); }} className="bg-blue-600 hover:bg-blue-700 font-bold">Simulate Detect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New FD Dialog */}
      <Dialog open={isFDOpen} onOpenChange={setIsFDOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Fixed Deposit Configuration</DialogTitle>
            <DialogDescription>Secure high-yield returns with our capital protection guarantee.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOpenFD} className="space-y-6 pt-4">
             <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Investment Quantum</Label>
                   <Input type="number" placeholder="Min ₹10,000" className="h-11 font-black" required />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tenure Horizon</Label>
                   <Select required>
                      <SelectTrigger className="h-11 font-bold">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1y">1 Year @ 7.5% p.a.</SelectItem>
                        <SelectItem value="2y">2 Years @ 7.8% p.a.</SelectItem>
                        <SelectItem value="3y">3 Years @ 8.1% p.a.</SelectItem>
                        <SelectItem value="5y">5 Years @ 8.5% p.a.</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-700">Estimated Maturity</span>
                      <span className="text-lg font-black text-emerald-600">--</span>
                   </div>
                </div>
             </div>
             <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => setIsFDOpen(false)} className="font-bold">Cancel</Button>
                <Button type="submit" disabled={fdLoading} className="shadow-lg shadow-primary/20 font-bold">
                   {fdLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking...</> : 'Confirm Issuance'}
                </Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(256px); }
        }
      `}</style>
    </div>
  )
}
