import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Progress } from '@/components/ui/progress'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreditCard, Lock, Unlock, Eye, Settings, Snowflake, Wifi, Loader2, CheckCircle2, Shield, Globe, ShoppingCart, Banknote } from 'lucide-react'
import { toast } from 'sonner'

const initialCards = [
  { id: 1, type: 'Debit Card', name: 'SecureBank Platinum Debit', number: '**** **** **** 4521', holder: 'RAJESH KUMAR', expiry: '10/28', brand: 'Visa', frozen: false, limit: 200000, used: 15000, color: 'from-gray-800 to-gray-900' },
  { id: 2, type: 'Credit Card', name: 'SecureBank Rewards Credit', number: '**** **** **** 8765', holder: 'RAJESH KUMAR', expiry: '12/27', brand: 'Mastercard', frozen: false, limit: 500000, used: 125000, color: 'from-blue-700 to-indigo-800' },
  { id: 3, type: 'Credit Card', name: 'SecureBank Business Credit', number: '**** **** **** 3456', holder: 'RAJESH KUMAR', expiry: '06/29', brand: 'Visa', frozen: true, limit: 1000000, used: 230000, color: 'from-violet-700 to-purple-800' },
]
const cardTransactions = [
  { id: 1, merchant: 'Amazon.in', amount: 2499, date: '10 Mar 2026', type: 'Debit', card: '4521' },
  { id: 2, merchant: 'Flipkart', amount: 5999, date: '09 Mar 2026', type: 'Credit', card: '8765' },
  { id: 3, merchant: 'Swiggy', amount: 450, date: '09 Mar 2026', type: 'Debit', card: '4521' },
  { id: 4, merchant: 'BigBasket', amount: 2340, date: '08 Mar 2026', type: 'Credit', card: '8765' },
  { id: 5, merchant: 'Udemy', amount: 449, date: '07 Mar 2026', type: 'Debit', card: '3456' },
]

export default function Cards() {
  const [cards, setCards] = useState(initialCards)
  const [cardStates, setCardStates] = useState(initialCards.reduce((a, c) => ({ ...a, [c.id]: c.frozen }), {}))
  const [cardSwitches, setCardSwitches] = useState(initialCards.reduce((a, c) => ({ ...a, [c.id]: { contactless: true, online: true, intl: false, atm: true } }), {}))
  const [cardLimits, setCardLimits] = useState(initialCards.reduce((a, c) => ({ ...a, [c.id]: c.limit }), {}))
  const [pinDialog, setPinDialog] = useState(false)
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [revealedPin, setRevealedPin] = useState(null)
  const [applyCardOpen, setApplyCardOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  const [cardForm, setCardForm] = useState({ type: '', variant: '', income: '', employment: '' })
  const [settingsTab, setSettingsTab] = useState('1')

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  const toggleFreeze = (id) => {
    const newState = !cardStates[id]
    setCardStates(prev => ({ ...prev, [id]: newState }))
    toast.success(newState ? 'Card frozen successfully' : 'Card unfrozen successfully')
  }

  const handleVerifyOtp = () => {
    if (otp.length !== 6) { toast.error('Please enter a valid 6-digit OTP'); return }
    setIsVerifying(true)
    setTimeout(() => { setRevealedPin('4521'); setIsVerifying(false); toast.success('PIN revealed') }, 1500)
  }

  const handleApplyCard = () => {
    if (!cardForm.type || !cardForm.variant) { toast.error('Please select card type and variant'); return }
    setIsApplying(true)
    setTimeout(() => { setIsApplying(false); setApplicationSuccess(true) }, 2000)
  }

  const closeApplyDialog = () => { setApplyCardOpen(false); setApplicationSuccess(false); setCardForm({ type: '', variant: '', income: '', employment: '' }) }

  const toggleSwitch = (cardId, key) => {
    setCardSwitches(prev => ({ ...prev, [cardId]: { ...prev[cardId], [key]: !prev[cardId][key] } }))
    toast.success(`Feature updated for card`)
  }

  return (
    <div className="space-y-8 animate-fade-in" id="cards-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Cards</h2>
          <p className="text-sm text-muted-foreground">Swipe through cards, adjust limits, and manage settings</p>
        </div>
        <Button onClick={() => setApplyCardOpen(true)} id="btn-apply-card">
          <CreditCard className="h-4 w-4 mr-2" />Apply for New Card
        </Button>
      </div>

      {/* ── CAROUSEL of Cards ── */}
      <div id="cards-carousel-section">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Your Cards</h3>
        <Carousel className="w-full" id="cards-carousel" opts={{ align: 'start' }}>
          <CarouselContent className="-ml-4">
            {cards.map(card => {
              const isFrozen = cardStates[card.id]
              const usePct = Math.round((card.used / card.limit) * 100)
              return (
                <CarouselItem key={card.id} id={`carousel-card-${card.id}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border shadow-md hover:shadow-xl transition-shadow">
                    {/* Visual Card */}
                    <div className={`relative bg-gradient-to-br ${card.color} p-6 text-white aspect-[1.6/1] flex flex-col justify-between ${isFrozen ? 'brightness-50 grayscale' : ''} transition-all duration-300`}>
                      {isFrozen && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                          <div className="text-center text-white">
                            <Snowflake className="h-8 w-8 mx-auto mb-1 animate-pulse" />
                            <p className="text-xs font-bold">FROZEN</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-white/70">{card.type}</p>
                          <p className="text-sm font-bold mt-0.5">{card.name}</p>
                        </div>
                        <Wifi className="h-5 w-5 text-white/40 rotate-90" />
                      </div>
                      <div>
                        <div className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 mb-4" />
                        <p className="font-mono tracking-[.25em] text-base">{card.number}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-white/60 uppercase tracking-widest">Holder</p>
                          <p className="text-sm font-semibold">{card.holder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/60 uppercase tracking-widest">Expires</p>
                          <p className="text-sm font-semibold">{card.expiry}</p>
                        </div>
                        <p className="text-sm font-black italic">{card.brand}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Button variant={isFrozen ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => toggleFreeze(card.id)} id={`btn-freeze-${card.id}`}>
                          {isFrozen ? <Unlock className="h-3.5 w-3.5 mr-1" /> : <Snowflake className="h-3.5 w-3.5 mr-1" />}
                          {isFrozen ? 'Unfreeze' : 'Freeze'}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setPinDialog(true)} id={`btn-view-pin-${card.id}`}>
                              <Eye className="h-3.5 w-3.5 mr-1" /> View PIN
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Requires OTP verification</TooltipContent>
                        </Tooltip>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSettingsTab(String(card.id))} id={`btn-card-settings-${card.id}`}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <Separator />
                      {/* Usage */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Usage</span>
                          <span className="font-bold">₹{card.used.toLocaleString()} / ₹{card.limit.toLocaleString()}</span>
                        </div>
                        <Progress value={usePct} className="h-2" />
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span className={usePct > 80 ? 'text-destructive font-bold' : ''}>{usePct}% used</span>
                          <span>Avail: ₹{(card.limit - card.used).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious id="btn-carousel-prev" className="left-2" />
          <CarouselNext id="btn-carousel-next" className="right-2" />
        </Carousel>
      </div>

      {/* ── Card Settings with Tabs, Slider, Switch ── */}
      <div id="section-card-settings">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Card Settings</h3>
        <Tabs value={settingsTab} onValueChange={setSettingsTab} id="card-settings-tabs">
          <TabsList className="mb-4" id="card-settings-tabslist">
            {cards.map(c => (
              <TabsTrigger key={c.id} value={String(c.id)} id={`tab-card-${c.id}`}>
                ••{c.number.slice(-4)}
              </TabsTrigger>
            ))}
          </TabsList>

          {cards.map(card => (
            <TabsContent key={card.id} value={String(card.id)} id={`tab-content-card-${card.id}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Limit Slider */}
                <Card className="border shadow-sm" id={`card-limit-settings-${card.id}`}>
                  <CardHeader><CardTitle className="text-sm font-bold">Transaction Limits</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: 'Daily Spending Limit', key: `daily-${card.id}`, max: card.limit, defaultVal: Math.floor(card.limit * 0.5) },
                      { label: 'ATM Withdrawal Limit', key: `atm-${card.id}`, max: 50000, defaultVal: 25000 },
                    ].map((item, i) => {
                      const [val, setVal] = useState([item.defaultVal])
                      return (
                        <div key={i} className="space-y-2" id={`slider-${item.key}`}>
                          <div className="flex justify-between text-sm">
                            <Label className="font-medium">{item.label}</Label>
                            <Badge variant="outline" className="font-mono">₹{val[0].toLocaleString('en-IN')}</Badge>
                          </div>
                          <Slider min={0} max={item.max} step={1000} value={val} onValueChange={setVal} id={`slider-input-${item.key}`} />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>₹0</span><span>₹{item.max.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      )
                    })}
                    <Button className="w-full" id={`btn-save-limits-${card.id}`} onClick={() => toast.success('Limits updated!')}>
                      Save Limits
                    </Button>
                  </CardContent>
                </Card>

                {/* Feature Toggles via Switch */}
                <Card className="border shadow-sm" id={`card-features-${card.id}`}>
                  <CardHeader><CardTitle className="text-sm font-bold">Card Features</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'contactless', label: 'Contactless Payments', icon: Wifi, desc: 'Tap to pay' },
                      { key: 'online', label: 'Online Transactions', icon: ShoppingCart, desc: 'E-commerce & apps' },
                      { key: 'intl', label: 'International Usage', icon: Globe, desc: 'For overseas transactions' },
                      { key: 'atm', label: 'ATM Withdrawals', icon: Banknote, desc: 'Cash withdrawal at ATMs' },
                    ].map(feature => (
                      <div key={feature.key} className="flex items-center justify-between" id={`switch-${feature.key}-${card.id}`}>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                            <feature.icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{feature.label}</p>
                            <p className="text-xs text-muted-foreground">{feature.desc}</p>
                          </div>
                        </div>
                        <Switch
                          id={`sw-${feature.key}-${card.id}`}
                          checked={cardSwitches[card.id]?.[feature.key] ?? true}
                          onCheckedChange={() => toggleSwitch(card.id, feature.key)}
                        />
                      </div>
                    ))}
                    <Separator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full" id={`btn-block-card-${card.id}`}>
                          <Lock className="h-4 w-4 mr-2" /> Block This Card
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent id={`alert-block-card-${card.id}`}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Block {card.name}?</AlertDialogTitle>
                          <AlertDialogDescription>All transactions including pending will be stopped immediately. You can unblock it from card settings anytime.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel id={`btn-cancel-block-${card.id}`}>Cancel</AlertDialogCancel>
                          <AlertDialogAction id={`btn-confirm-block-${card.id}`} className="bg-destructive hover:bg-destructive/90" onClick={() => toast.warning(`${card.name} has been blocked.`)}>Block Card</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Recent Transactions */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-bold">Recent Card Transactions</CardTitle>
          <Badge variant="outline">{cardTransactions.length} transactions</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table id="card-txn-table">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-6 text-xs uppercase tracking-wider font-bold">Merchant</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-bold">Card</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right font-bold">Amount</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-bold">Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center font-bold pr-6">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardTransactions.map(txn => (
                <TableRow key={txn.id} id={`card-txn-row-${txn.id}`} className="hover:bg-muted/30">
                  <TableCell className="pl-6 font-semibold">{txn.merchant}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">****{txn.card}</TableCell>
                  <TableCell className="text-right font-bold">₹{txn.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{txn.date}</TableCell>
                  <TableCell className="text-center pr-6">
                    <Badge variant="outline" className={txn.type === 'Debit' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>{txn.type}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PIN Dialog with InputOTP */}
      <Dialog open={pinDialog} onOpenChange={() => { setPinDialog(false); setRevealedPin(null); setOtp('') }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>View Card PIN</DialogTitle>
            <DialogDescription>{revealedPin ? 'Your PIN is shown below.' : 'Enter the 6-digit OTP sent to your registered mobile.'}</DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            {!revealedPin ? (
              <>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} id="pin-otp-input">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} id="pin-otp-0" />
                    <InputOTPSlot index={1} id="pin-otp-1" />
                    <InputOTPSlot index={2} id="pin-otp-2" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} id="pin-otp-3" />
                    <InputOTPSlot index={4} id="pin-otp-4" />
                    <InputOTPSlot index={5} id="pin-otp-5" />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">OTP sent to ••••••7890</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 bg-muted/30 rounded-xl border border-dashed w-full">
                <Shield className="h-8 w-8 text-blue-600" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Your PIN</p>
                <p className="text-5xl font-mono tracking-[0.3em] font-bold text-primary">{revealedPin}</p>
                <p className="text-[10px] text-destructive font-bold uppercase mt-1">Will hide in 30 seconds</p>
              </div>
            )}
          </div>
          <DialogFooter>
            {!revealedPin
              ? <Button id="btn-verify-pin-otp" onClick={handleVerifyOtp} disabled={isVerifying} className="w-full">
                  {isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</> : 'Verify & Reveal PIN'}
                </Button>
              : <Button id="btn-close-pin-dialog" onClick={() => { setPinDialog(false); setRevealedPin(null); setOtp('') }} className="w-full">Done</Button>
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Card Dialog */}
      <Dialog open={applyCardOpen} onOpenChange={closeApplyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Apply for a New Card</DialogTitle>
            <DialogDescription>Fill in your details to submit a card application.</DialogDescription>
          </DialogHeader>
          {!applicationSuccess ? (
            <>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Card Type <span className="text-red-500">*</span></Label>
                    <Select value={cardForm.type} onValueChange={v => setCardForm({ ...cardForm, type: v })}>
                      <SelectTrigger id="apply-card-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Variant <span className="text-red-500">*</span></Label>
                    <Select value={cardForm.variant} onValueChange={v => setCardForm({ ...cardForm, variant: v })}>
                      <SelectTrigger id="apply-card-variant"><SelectValue placeholder="Select variant" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="signature">Signature</SelectItem>
                        <SelectItem value="infinite">Infinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Annual Income (₹)</Label>
                  <Input id="apply-card-income" type="number" placeholder="e.g. 600000" value={cardForm.income} onChange={e => setCardForm({ ...cardForm, income: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Employment Type</Label>
                  <Select value={cardForm.employment} onValueChange={v => setCardForm({ ...cardForm, employment: v })}>
                    <SelectTrigger id="apply-card-employment"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeApplyDialog} id="btn-cancel-apply-card">Cancel</Button>
                <Button id="btn-submit-apply-card" onClick={handleApplyCard} disabled={isApplying} className="min-w-[140px]">
                  {isApplying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : 'Submit Application'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Application Submitted!</h3>
              <p className="text-sm text-muted-foreground">Your {cardForm.variant} {cardForm.type} card application has been received.</p>
              <p className="text-xs font-mono text-muted-foreground">Application ID: CARD-{Math.floor(Math.random() * 900000 + 100000)}</p>
              <Button id="btn-done-apply-card" onClick={closeApplyDialog} className="mt-2">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
