import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { toast } from 'sonner'
import {
  CheckCircle2, XCircle, Info, AlertTriangle, Loader2, Send,
  RefreshCw, Bell, CreditCard, TrendingUp, DollarSign, Shield,
  Trash2, ArrowRight, Clock
} from 'lucide-react'

export default function FeedbackDemo() {
  const [progressVal, setProgressVal] = useState(30)
  const [isLoading, setIsLoading] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [investDialogOpen, setInvestDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    console.log('[ROUTE] Current path:', window.location.pathname)
    const t = setInterval(() => setProgressVal(p => p >= 95 ? 15 : p + 3), 600)
    return () => clearInterval(t)
  }, [])

  const simulateLoading = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 2500))
    setIsLoading(false)
    toast.success('Data refreshed successfully!')
  }

  return (
    <div id="feedback-demo-page" className="space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground mt-1.5">Dialog, Drawer, Alert Dialog, Toast, Sonner, Progress, Skeleton</p>
      </div>

      {/* ─── TOAST / SONNER ─── */}
      <section id="section-toast">
        <h2 className="text-xl font-bold mb-4">Toast / Sonner Notifications</h2>
        <p className="text-sm text-muted-foreground mb-4">Click buttons to trigger different notification types</p>
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="toast-buttons">
              <Button id="btn-toast-success" variant="outline" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => toast.success('Transfer Successful!', { description: '₹15,000 sent to Priya Anand successfully.' })}>
                <CheckCircle2 className="h-4 w-4" /> Success Toast
              </Button>
              <Button id="btn-toast-error" variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => toast.error('Transfer Failed', { description: 'Insufficient balance. Please add funds.' })}>
                <XCircle className="h-4 w-4" /> Error Toast
              </Button>
              <Button id="btn-toast-info" variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => toast.info('OTP Sent', { description: 'A 6-digit OTP was sent to ••••••7890.' })}>
                <Info className="h-4 w-4" /> Info Toast
              </Button>
              <Button id="btn-toast-warning" variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => toast.warning('Low Balance', { description: 'Balance below minimum threshold of ₹10,000.' })}>
                <AlertTriangle className="h-4 w-4" /> Warning Toast
              </Button>
              <Button id="btn-toast-loading" variant="outline" className="gap-2"
                onClick={() => toast.loading('Processing transfer...', { duration: 2000 })}>
                <Loader2 className="h-4 w-4" /> Loading Toast
              </Button>
              <Button id="btn-toast-promise" variant="outline" className="gap-2"
                onClick={() => toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: 'Verifying payment...', success: 'Payment verified!', error: 'Verification failed' })}>
                <RefreshCw className="h-4 w-4" /> Promise Toast
              </Button>
              <Button id="btn-toast-action" variant="outline" className="gap-2"
                onClick={() => toast('Scheduled Transfer Set', { description: 'Monthly ₹5,000 to Family Account', action: { label: 'Undo', onClick: () => toast.info('Transfer cancelled.') } })}>
                <Clock className="h-4 w-4" /> Action Toast
              </Button>
              <Button id="btn-toast-custom" className="gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:from-violet-700 hover:to-purple-800"
                onClick={() => toast.custom(() => (
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white shadow-xl">
                    <Shield className="h-5 w-5 shrink-0" />
                    <div><p className="font-semibold text-sm">Security Alert</p><p className="text-xs text-blue-200">New login from Chrome, Mumbai</p></div>
                  </div>
                ))}>
                <Bell className="h-4 w-4" /> Custom Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── DIALOG ─── */}
      <section id="section-dialog">
        <h2 className="text-xl font-bold mb-4">Dialog</h2>
        <p className="text-sm text-muted-foreground mb-4">Modal dialogs for confirmations and complex forms</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transfer Dialog */}
          <Card className="border shadow-sm" id="card-transfer-dialog">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="h-4 w-4" /> Transfer Dialog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button id="btn-open-transfer-dialog">Open Transfer Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" id="transfer-dialog">
                  <DialogHeader>
                    <DialogTitle>Initiate Fund Transfer</DialogTitle>
                    <DialogDescription>Transfer funds securely between accounts or to registered beneficiaries.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="dialog-from">From Account</Label>
                      <Select defaultValue="sav-4521">
                        <SelectTrigger id="dialog-from"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sav-4521">Savings – ••4521 (₹1,52,340)</SelectItem>
                          <SelectItem value="cur-8832">Current – ••8832 (₹3,00,000)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dialog-to">To Beneficiary</Label>
                      <Input id="dialog-to" placeholder="Enter account / beneficiary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dialog-amount">Amount (₹)</Label>
                      <Input id="dialog-amount" type="number" placeholder="Enter amount" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dialog-remarks">Remarks</Label>
                      <Input id="dialog-remarks" placeholder="Optional reference" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button id="btn-cancel-transfer-dialog" variant="outline" onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
                    <Button id="btn-confirm-transfer-dialog" onClick={() => { setTransferDialogOpen(false); toast.success('Transfer initiated!') }}>
                      <Send className="h-4 w-4 mr-2" /> Transfer Now
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Investment Dialog */}
          <Card className="border shadow-sm" id="card-invest-dialog">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Investment Dialog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
                <DialogTrigger asChild>
                  <Button id="btn-open-invest-dialog" variant="outline">View Investment Details</Button>
                </DialogTrigger>
                <DialogContent id="invest-dialog">
                  <DialogHeader>
                    <DialogTitle>Portfolio Summary</DialogTitle>
                    <DialogDescription>Overview of your investment portfolio as of March 2024</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    {[
                      { name: 'HDFC Equity Fund', invested: 100000, current: 120000, returns: '+20%' },
                      { name: 'SBI Blue Chip Fund', invested: 75000, current: 80000, returns: '+6.7%' },
                      { name: 'Axis Index Fund', invested: 50000, current: 60000, returns: '+20%' },
                    ].map((inv, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl border">
                        <div>
                          <p className="text-sm font-medium">{inv.name}</p>
                          <p className="text-xs text-muted-foreground">Invested: ₹{inv.invested.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">₹{inv.current.toLocaleString()}</p>
                          <p className="text-xs text-emerald-600 font-semibold">{inv.returns}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button id="btn-close-invest-dialog" variant="outline" onClick={() => setInvestDialogOpen(false)}>Close</Button>
                    <Button id="btn-add-investment-dialog" onClick={() => { setInvestDialogOpen(false); toast.info('Redirecting to investments...') }}>
                      <DollarSign className="h-4 w-4 mr-2" /> Add Investment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── ALERT DIALOG ─── */}
      <section id="section-alert-dialog-feedback">
        <h2 className="text-xl font-bold mb-4">Alert Dialog</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex flex-wrap gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button id="btn-alert-dialog-delete" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Beneficiary
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent id="alert-dialog-delete">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Beneficiary?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove Priya Anand (SBI – ••3421) from your saved beneficiaries. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel id="btn-alert-cancel-delete">Keep Beneficiary</AlertDialogCancel>
                  <AlertDialogAction id="btn-alert-confirm-delete" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={() => toast.success('Beneficiary removed.')}>
                    Yes, Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button id="btn-alert-dialog-block" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Shield className="h-4 w-4 mr-2" /> Block Card
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent id="alert-dialog-block">
                <AlertDialogHeader>
                  <AlertDialogTitle>Block Credit Card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Blocking Visa Platinum ••4521 will immediately stop all transactions. You can unblock it anytime in Card Settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel id="btn-alert-cancel-block">Cancel</AlertDialogCancel>
                  <AlertDialogAction id="btn-alert-confirm-block" onClick={() => toast.warning('Card blocked successfully.')}>
                    Block Card
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </section>

      {/* ─── DRAWER ─── */}
      <section id="section-drawer">
        <h2 className="text-xl font-bold mb-4">Drawer</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex flex-wrap gap-4">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button id="btn-open-drawer" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" /> Open Card Drawer
                </Button>
              </DrawerTrigger>
              <DrawerContent id="card-drawer">
                <div className="mx-auto w-full max-w-lg">
                  <DrawerHeader>
                    <DrawerTitle>Card Management</DrawerTitle>
                    <DrawerDescription>Manage your credit and debit cards from here.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 space-y-3 pb-4">
                    {[
                      { name: 'Visa Platinum', last: '4521', status: 'Active', limit: '₹1,00,000', color: 'from-blue-600 to-indigo-700' },
                      { name: 'MasterCard Gold', last: '3812', status: 'Active', limit: '₹50,000', color: 'from-emerald-500 to-teal-600' },
                      { name: 'SBI Debit Card', last: '7901', status: 'Active', limit: '₹25,000', color: 'from-violet-500 to-purple-600' },
                    ].map((card, i) => (
                      <div key={i} id={`drawer-card-${i}`} className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} text-white`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold">{card.name}</p>
                            <p className="font-mono text-sm opacity-80">•••• •••• •••• {card.last}</p>
                          </div>
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">{card.status}</Badge>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <span className="text-xs opacity-70">Limit: {card.limit}</span>
                          <Button size="sm" variant="secondary" className="text-xs h-7"
                            onClick={() => { setDrawerOpen(false); toast.info(`Managing ${card.name}`) }}>
                            Manage <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <Button id="btn-apply-new-card" onClick={() => { setDrawerOpen(false); toast.success('Card application started!') }}>
                      Apply for New Card
                    </Button>
                    <DrawerClose asChild>
                      <Button id="btn-close-drawer" variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </CardContent>
        </Card>
      </section>

      {/* ─── PROGRESS INDICATORS ─── */}
      <section id="section-progress-feedback">
        <h2 className="text-xl font-bold mb-4">Progress Indicators</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-6" id="progress-indicators">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Live Animated KYC Progress</span>
                <span className="text-muted-foreground">{progressVal}%</span>
              </div>
              <Progress id="animated-progress" value={progressVal} className="h-3" />
              <p className="text-xs text-muted-foreground">Progress updates automatically every 600ms</p>
            </div>
            <Separator />
            {[
              { label: 'Loan Application', value: 80, note: 'Verification pending' },
              { label: 'Credit Card Limit Used', value: 62, note: '₹62K of ₹1L' },
              { label: 'Savings Target', value: 45, note: '₹45K of ₹1L' },
            ].map((item, i) => (
              <div key={i} id={`progress-item-${i}`} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <Badge variant="outline" className="text-xs">{item.note}</Badge>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}

            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Loading State</p>
              <Button id="btn-trigger-loading" variant="outline" onClick={simulateLoading} disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Refreshing...</> : <><RefreshCw className="h-4 w-4 mr-2" /> Refresh Data</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── SKELETON LOADERS ─── */}
      <section id="section-skeleton-feedback">
        <h2 className="text-xl font-bold mb-4">Skeleton Loaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm" id="skeleton-transaction-card">
            <CardHeader><CardTitle className="text-base">Transaction List Skeleton</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} id={`skeleton-txn-${i}`} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border shadow-sm" id="skeleton-profile-card">
            <CardHeader><CardTitle className="text-base">Profile Card Skeleton</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 rounded-xl" />
                  <Skeleton className="h-10 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm md:col-span-2" id="skeleton-dashboard-card">
            <CardHeader><CardTitle className="text-base">Dashboard Skeleton</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-[180px] w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
