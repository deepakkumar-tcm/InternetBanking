import { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Search, Zap, Wifi, Droplets, Monitor, Phone, Shield, Fuel, Loader2, CheckCircle2, Plus, Info, History, CalendarClock, RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'

const initialBillers = [
  { id: 1, name: 'BESCOM - Electricity', icon: Zap,     category: 'Electricity',   amount: 1850,  dueDate: '15 Mar 2026', color: 'text-yellow-600 bg-yellow-50', paid: false, autoPay: true },
  { id: 2, name: 'ACT Fibernet',         icon: Wifi,    category: 'Internet',      amount: 999,   dueDate: '20 Mar 2026', color: 'text-blue-600 bg-blue-50',     paid: false, autoPay: false },
  { id: 3, name: 'BWSSB - Water',        icon: Droplets,category: 'Water',         amount: 350,   dueDate: '25 Mar 2026', color: 'text-cyan-600 bg-cyan-50',     paid: false, autoPay: false },
  { id: 4, name: 'Netflix',              icon: Monitor, category: 'Entertainment', amount: 649,   dueDate: '01 Apr 2026', color: 'text-red-600 bg-red-50',       paid: false, autoPay: true },
  { id: 5, name: 'Airtel Postpaid',      icon: Phone,   category: 'Mobile',        amount: 599,   dueDate: '18 Mar 2026', color: 'text-purple-600 bg-purple-50', paid: false, autoPay: true },
  { id: 6, name: 'LIC Premium',          icon: Shield,  category: 'Insurance',     amount: 12500, dueDate: '10 Apr 2026', color: 'text-emerald-600 bg-emerald-50',paid: false, autoPay: false },
  { id: 7, name: 'Indian Oil - HPCL',    icon: Fuel,    category: 'Fuel',          amount: 2500,  dueDate: '22 Mar 2026', color: 'text-orange-600 bg-orange-50', paid: false, autoPay: false },
]
const recentPaymentsBase = [
  { id: 1, biller: 'BESCOM',        amount: 1680, date: '10 Mar 2026', method: 'Auto Pay', status: 'Paid' },
  { id: 2, biller: 'ACT Fibernet',  amount: 999,  date: '05 Mar 2026', method: 'Manual',   status: 'Paid' },
  { id: 3, biller: 'Airtel Postpaid',amount: 599, date: '03 Mar 2026', method: 'Auto Pay', status: 'Paid' },
  { id: 4, biller: 'Netflix',       amount: 649,  date: '01 Mar 2026', method: 'Auto Pay', status: 'Paid' },
]
const categoryColors = {
  Electricity: 'text-yellow-600 bg-yellow-50', Internet: 'text-blue-600 bg-blue-50',
  Water: 'text-cyan-600 bg-cyan-50', Entertainment: 'text-red-600 bg-red-50',
  Mobile: 'text-purple-600 bg-purple-50', Insurance: 'text-emerald-600 bg-emerald-50',
  Fuel: 'text-orange-600 bg-orange-50', Other: 'text-gray-600 bg-gray-50',
}
const iconOptions = { Zap, Wifi, Droplets, Monitor, Phone, Shield, Fuel }

export default function BillPayments() {
  const [billers, setBillers]           = useState(initialBillers)
  const [searchTerm, setSearchTerm]     = useState('')
  const [activeTab, setActiveTab]       = useState('all')
  const [payingId, setPayingId]         = useState(null)
  const [newBillerOpen, setNewBillerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentPayments, setRecentPayments] = useState(recentPaymentsBase)
  const [payMethod, setPayMethod]       = useState('upi')
  const [newBiller, setNewBiller] = useState({ name: '', category: '', amount: '', dueDate: '' })
  const recentRef = useRef(null)

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  const filtered = billers.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTab = activeTab === 'all' || (activeTab === 'pending' && !b.paid) || (activeTab === 'paid' && b.paid) || (activeTab === 'autopay' && b.autoPay)
    return matchSearch && matchTab
  })

  const toggleAutoPay = (id) => {
    setBillers(prev => prev.map(b => b.id === id ? { ...b, autoPay: !b.autoPay } : b))
    const b = billers.find(x => x.id === id)
    toast.success(`Auto Pay ${!b.autoPay ? 'enabled' : 'disabled'} for ${b.name}`)
  }

  const handlePay = (id, name, amount) => {
    setPayingId(id)
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        setBillers(prev => prev.map(b => b.id === id ? { ...b, paid: true } : b))
        setRecentPayments(prev => [{ id: `new-${Date.now()}`, biller: name.split(' - ')[0], amount, date: 'Today', method: payMethod === 'auto' ? 'Auto Pay' : 'Manual', status: 'Paid' }, ...prev])
        setPayingId(null)
        resolve({ name, amount })
      }, 2000)),
      { loading: `Processing payment for ${name}...`, success: d => `₹${d.amount.toLocaleString()} paid to ${d.name}!`, error: 'Payment failed.' }
    )
  }

  const handleAddBiller = () => {
    if (!newBiller.name || !newBiller.category || !newBiller.amount) { toast.error('Fill all required fields'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      const icons = Object.values(iconOptions)
      setBillers(prev => [{
        id: Date.now(), name: newBiller.name,
        icon: icons[Math.floor(Math.random() * icons.length)],
        category: newBiller.category, amount: parseFloat(newBiller.amount),
        dueDate: newBiller.dueDate || '30 Mar 2026',
        color: categoryColors[newBiller.category] || categoryColors.Other,
        paid: false, autoPay: false
      }, ...prev])
      setIsSubmitting(false); setNewBillerOpen(false)
      setNewBiller({ name: '', category: '', amount: '', dueDate: '' })
      toast.success('Biller added successfully!')
    }, 1500)
  }

  const totalDue = billers.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0)
  const totalPaid = billers.filter(b => b.paid).reduce((s, b) => s + b.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in" id="billpayments-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bill Payments</h2>
          <p className="text-sm text-muted-foreground">Pay bills, manage Auto Pay and track payment history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('Syncing latest bill amounts...')} id="btn-sync-bills">
            <RefreshCw className="h-4 w-4 mr-2" /> Sync
          </Button>
          <Button onClick={() => setNewBillerOpen(true)} id="btn-add-biller">
            <Plus className="h-4 w-4 mr-2" /> Add Biller
          </Button>
        </div>
      </div>

      {/* Menubar */}
      <Menubar id="bills-menubar" className="w-fit">
        <MenubarMenu>
          <MenubarTrigger id="menu-bills-file">Bills</MenubarTrigger>
          <MenubarContent>
            <MenubarItem id="menu-add-biller" onSelect={() => setNewBillerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Biller <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem id="menu-sync-bills" onSelect={() => toast.info('Syncing...')}>
              <RefreshCw className="mr-2 h-4 w-4" /> Sync All Bills
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Pay Method</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onSelect={() => { setPayMethod('upi'); toast.success('UPI selected') }}>UPI</MenubarItem>
                <MenubarItem onSelect={() => { setPayMethod('netbanking'); toast.success('Net Banking selected') }}>Net Banking</MenubarItem>
                <MenubarItem onSelect={() => { setPayMethod('debit'); toast.success('Debit Card selected') }}>Debit Card</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem id="menu-download-bills" onSelect={() => toast.success('Bill report downloaded!')}>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger id="menu-bills-history">History</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => recentRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <History className="mr-2 h-4 w-4" /> View Recent Payments
            </MenubarItem>
            <MenubarItem onSelect={() => toast.info('Opening full history...')}>
              <CalendarClock className="mr-2 h-4 w-4" /> Full Payment History
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger id="menu-bills-help">Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => toast.info('Opening support...')}>
              <Info className="mr-2 h-4 w-4" /> How Auto Pay Works
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="bill-summary">
        {[
          { label: 'Total Due', value: `₹${totalDue.toLocaleString('en-IN')}`, sub: `${billers.filter(b => !b.paid).length} bills`, pct: 65, color: 'text-amber-600' },
          { label: 'Paid This Month', value: `₹${totalPaid.toLocaleString('en-IN')}`, sub: `${billers.filter(b => b.paid).length} bills`, pct: 35, color: 'text-emerald-600' },
          { label: 'Auto Pay Active', value: `${billers.filter(b => b.autoPay).length} billers`, sub: 'Automated', pct: Math.round(billers.filter(b => b.autoPay).length / billers.length * 100), color: 'text-blue-600' },
        ].map((item, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
              <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              <Progress value={item.pct} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs + Billers Grid */}
      <Tabs value={activeTab} onValueChange={setActiveTab} id="bills-tabs">
        <div className="flex items-center justify-between mb-4">
          <TabsList id="bills-tabslist">
            <TabsTrigger value="all" id="tab-bills-all">All Bills</TabsTrigger>
            <TabsTrigger value="pending" id="tab-bills-pending">Pending</TabsTrigger>
            <TabsTrigger value="paid" id="tab-bills-paid">Paid</TabsTrigger>
            <TabsTrigger value="autopay" id="tab-bills-autopay">Auto Pay</TabsTrigger>
          </TabsList>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="biller-search" placeholder="Search billers…" className="pl-9 h-8 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {['all', 'pending', 'paid', 'autopay'].map(tab => (
          <TabsContent key={tab} value={tab} id={`tab-content-bills-${tab}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" id={`biller-grid-${tab}`}>
              {filtered.map(biller => {
                const Icon = biller.icon
                const isPaying = payingId === biller.id
                return (
                  <Card key={biller.id} id={`biller-card-${biller.id}`} className={`group relative transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 ${biller.paid ? 'opacity-70' : ''}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${biller.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-tight">{biller.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{biller.category}</p>
                          </div>
                        </div>
                        {/* Auto Pay Switch */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" id={`btn-biller-opts-${biller.id}`}>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-3" id={`popover-biller-${biller.id}`}>
                            <div className="space-y-3">
                              <p className="text-xs font-bold">{biller.name}</p>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`sw-autopay-${biller.id}`} className="text-xs">Auto Pay</Label>
                                <Switch id={`sw-autopay-${biller.id}`} checked={biller.autoPay} onCheckedChange={() => toggleAutoPay(biller.id)} />
                              </div>
                              <p className="text-[10px] text-muted-foreground">Due: {biller.dueDate}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {biller.autoPay && (
                        <Badge className="mb-3 text-[10px] bg-blue-50 text-blue-700 border-blue-200 border" variant="outline">
                          Auto Pay ON
                        </Badge>
                      )}

                      <Separator className="my-3" />
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Amount Due</p>
                          <p className="text-xl font-black">₹{biller.amount.toLocaleString()}</p>
                          <p className={`text-[10px] font-bold mt-0.5 ${biller.paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {biller.paid ? '✓ Paid' : `Due: ${biller.dueDate}`}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" disabled={biller.paid || isPaying} id={`btn-pay-${biller.id}`}
                              className={biller.paid ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : ''}>
                              {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : biller.paid ? <CheckCircle2 className="h-4 w-4" /> : 'Pay Now'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent id={`alert-pay-${biller.id}`}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Pay ₹{biller.amount.toLocaleString('en-IN')} to <strong>{biller.name}</strong> via {payMethod.toUpperCase()}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            {/* Payment Method Radio */}
                            <div className="py-3">
                              <p className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">Payment Method</p>
                              <RadioGroup value={payMethod} onValueChange={setPayMethod} id={`radio-pay-method-${biller.id}`} className="space-y-2">
                                {[['upi', 'UPI / PhonePe / GPay'], ['netbanking', 'Net Banking'], ['debit', 'Debit Card ••4521']].map(([val, label]) => (
                                  <div key={val} className="flex items-center space-x-2">
                                    <RadioGroupItem value={val} id={`radio-${val}-${biller.id}`} />
                                    <Label htmlFor={`radio-${val}-${biller.id}`} className="text-sm font-medium cursor-pointer">{label}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel id={`btn-cancel-pay-${biller.id}`}>Cancel</AlertDialogCancel>
                              <AlertDialogAction id={`btn-confirm-pay-${biller.id}`} onClick={() => handlePay(biller.id, biller.name, biller.amount)}>
                                Confirm Payment
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filtered.length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground">
                  <p className="text-sm">No billers match your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent Payments */}
      <Card ref={recentRef} id="section-recent-payments">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-base font-bold">Recent Payment History</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold" onClick={() => toast.info('Full history loading...')} id="btn-view-all-payments">View All</Button>
        </CardHeader>
        <ScrollArea className="h-[250px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-bold uppercase tracking-widest pl-6">Biller</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-right">Amount</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest">Date</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest">Method</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-center pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.map(p => (
                <TableRow key={p.id} id={`payment-row-${p.id}`} className="hover:bg-muted/30">
                  <TableCell className="font-semibold pl-6">{p.biller}</TableCell>
                  <TableCell className="text-right font-bold">₹{p.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{p.method}</Badge></TableCell>
                  <TableCell className="text-center pr-6">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">{p.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Add Biller Dialog */}
      <Dialog open={newBillerOpen} onOpenChange={setNewBillerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Biller</DialogTitle>
            <DialogDescription>Register a biller to pay quickly next time.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Biller Name <span className="text-red-500">*</span></Label>
              <Input id="new-biller-name" placeholder="e.g. BSNL Broadband" value={newBiller.name} onChange={e => setNewBiller({ ...newBiller, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Category <span className="text-red-500">*</span></Label>
              <Select value={newBiller.category} onValueChange={v => setNewBiller({ ...newBiller, category: v })}>
                <SelectTrigger id="new-biller-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryColors).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Amount (₹) <span className="text-red-500">*</span></Label>
                <Input id="new-biller-amount" type="number" placeholder="0.00" value={newBiller.amount} onChange={e => setNewBiller({ ...newBiller, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Due Date</Label>
                <Input id="new-biller-duedate" type="date" value={newBiller.dueDate} onChange={e => setNewBiller({ ...newBiller, dueDate: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewBillerOpen(false)} disabled={isSubmitting} id="btn-cancel-add-biller">Cancel</Button>
            <Button id="btn-submit-add-biller" onClick={handleAddBiller} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding…</> : 'Add Biller'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
