import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { CreditCard, Lock, Unlock, Eye, EyeOff, Settings, Snowflake, Wifi, Loader2, CheckCircle2, Shield, Globe, ShoppingCart, Banknote, TrendingUp, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

// ── Full card data (full numbers & CVVs for reveal feature) ───────────────
const initialCards = [
  {
    id: 1, type: 'Debit Card', name: 'SecureBank Platinum Debit',
    number: '**** **** **** 4521', fullNumber: '4532015112304521', cvv: '123',
    holder: 'RAJESH KUMAR', expiry: '10/28', brand: 'Visa',
    frozen: false, limit: 200000, used: 15000, color: 'from-gray-800 to-gray-900',
  },
  {
    id: 2, type: 'Credit Card', name: 'SecureBank Rewards Credit',
    number: '**** **** **** 8765', fullNumber: '5425233430108765', cvv: '456',
    holder: 'RAJESH KUMAR', expiry: '12/27', brand: 'Mastercard',
    frozen: false, limit: 500000, used: 125000, color: 'from-blue-700 to-indigo-800',
  },
  {
    id: 3, type: 'Credit Card', name: 'SecureBank Business Credit',
    number: '**** **** **** 3456', fullNumber: '4916338506083456', cvv: '789',
    holder: 'RAJESH KUMAR', expiry: '06/29', brand: 'Visa',
    frozen: true, limit: 1000000, used: 230000, color: 'from-violet-700 to-purple-800',
  },
]

const cardTransactions = [
  { id: 1, merchant: 'Amazon.in',  amount: 2499, date: '10 Mar 2026', type: 'Debit',  card: '4521' },
  { id: 2, merchant: 'Flipkart',   amount: 5999, date: '09 Mar 2026', type: 'Credit', card: '8765' },
  { id: 3, merchant: 'Swiggy',     amount: 450,  date: '09 Mar 2026', type: 'Debit',  card: '4521' },
  { id: 4, merchant: 'BigBasket',  amount: 2340, date: '08 Mar 2026', type: 'Credit', card: '8765' },
  { id: 5, merchant: 'Udemy',      amount: 449,  date: '07 Mar 2026', type: 'Debit',  card: '3456' },
]

// Format 16-digit number as groups: XXXX  XXXX  XXXX  XXXX
function formatCardNumber(num) {
  return num.replace(/(\d{4})(?=\d)/g, '$1  ')
}

export default function Cards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState(initialCards)

  // ── Persisted state — load from localStorage, fall back to defaults ────────
  const [cardStates, setCardStates] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cards_freeze_state') || 'null')
      if (saved) return saved
    } catch {}
    return initialCards.reduce((a, c) => ({ ...a, [c.id]: c.frozen }), {})
  })

  const [cardSwitches, setCardSwitches] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cards_switches') || 'null')
      if (saved) return saved
    } catch {}
    return initialCards.reduce((a, c) => ({ ...a, [c.id]: { contactless: true, online: true, intl: false, atm: true } }), {})
  })

  // ── Slider state lifted to component level (was illegally inside .map) ──────
  const [sliderValues, setSliderValues] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cards_slider_values') || 'null')
      if (saved) return saved
    } catch {}
    return initialCards.reduce((acc, card) => ({
      ...acc,
      [card.id]: { daily: [Math.floor(card.limit * 0.5)], atm: [25000] },
    }), {})
  })

  // Persist to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('cards_freeze_state',  JSON.stringify(cardStates))   }, [cardStates])
  useEffect(() => { localStorage.setItem('cards_switches',      JSON.stringify(cardSwitches)) }, [cardSwitches])
  useEffect(() => { localStorage.setItem('cards_slider_values', JSON.stringify(sliderValues)) }, [sliderValues])

  const updateSlider = (cardId, key, value) => {
    setSliderValues(prev => ({ ...prev, [cardId]: { ...prev[cardId], [key]: value } }))
  }

  // ── View PIN dialog ────────────────────────────────────────────────────────
  const [pinDialog, setPinDialog]     = useState(false)
  const [pinOtp, setPinOtp]           = useState('')
  const [pinVerifying, setPinVerifying] = useState(false)
  const [revealedPin, setRevealedPin] = useState(null)

  const handleVerifyPinOtp = () => {
    if (pinOtp.length !== 6) { toast.error('Please enter a valid 6-digit OTP'); return }
    setPinVerifying(true)
    setTimeout(() => { setRevealedPin('4521'); setPinVerifying(false); toast.success('PIN revealed') }, 1500)
  }
  const closePinDialog = () => { setPinDialog(false); setRevealedPin(null); setPinOtp('') }

  // ── View Card Details (number + CVV) dialog ────────────────────────────────
  const [cardDetailsOpen, setCardDetailsOpen]       = useState(false)
  const [cardDetailsTarget, setCardDetailsTarget]   = useState(null)   // card object
  const [detailsOtp, setDetailsOtp]                 = useState('')
  const [detailsVerifying, setDetailsVerifying]     = useState(false)
  const [revealedDetails, setRevealedDetails]       = useState(null)   // { fullNumber, cvv }
  const [showCvv, setShowCvv]                       = useState(false)
  const [copiedField, setCopiedField]               = useState(null)   // 'number' | 'cvv'
  const [hideCountdown, setHideCountdown]           = useState(30)

  const openCardDetails = (card) => {
    setCardDetailsTarget(card)
    setDetailsOtp('')
    setDetailsVerifying(false)
    setRevealedDetails(null)
    setShowCvv(false)
    setCopiedField(null)
    setHideCountdown(30)
    setCardDetailsOpen(true)
  }

  const closeCardDetails = () => {
    setCardDetailsOpen(false)
    setTimeout(() => {
      setCardDetailsTarget(null)
      setRevealedDetails(null)
      setDetailsOtp('')
      setShowCvv(false)
      setCopiedField(null)
    }, 250)
  }

  const handleVerifyDetailsOtp = () => {
    if (detailsOtp.length !== 6) { toast.error('Please enter a valid 6-digit OTP'); return }
    setDetailsVerifying(true)
    setTimeout(() => {
      setDetailsVerifying(false)
      setRevealedDetails({ fullNumber: cardDetailsTarget.fullNumber, cvv: cardDetailsTarget.cvv })
      toast.success('Card details revealed')
    }, 1500)
  }

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      toast.success(`${field === 'number' ? 'Card number' : 'CVV'} copied`)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  // Countdown timer: auto-hide card details after 30 seconds
  useEffect(() => {
    if (!revealedDetails) return
    setHideCountdown(30)
    const interval = setInterval(() => {
      setHideCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          closeCardDetails()
          toast.info('Card details hidden for security')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [revealedDetails])

  // ── Apply Card dialog ──────────────────────────────────────────────────────
  const [applyCardOpen, setApplyCardOpen]         = useState(false)
  const [isApplying, setIsApplying]               = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  const [cardForm, setCardForm] = useState({ type: '', variant: '', income: '', employment: '' })
  const [settingsTab, setSettingsTab]             = useState('1')

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  const toggleFreeze = (id) => {
    const newState = !cardStates[id]
    setCardStates(prev => ({ ...prev, [id]: newState }))
    toast.success(newState ? 'Card frozen successfully' : 'Card unfrozen successfully')
  }

  const handleApplyCard = () => {
    if (!cardForm.type || !cardForm.variant) { toast.error('Please select card type and variant'); return }
    setIsApplying(true)
    setTimeout(() => { setIsApplying(false); setApplicationSuccess(true) }, 2000)
  }

  const closeApplyDialog = () => {
    setApplyCardOpen(false)
    setApplicationSuccess(false)
    setCardForm({ type: '', variant: '', income: '', employment: '' })
  }

  const toggleSwitch = (cardId, key) => {
    setCardSwitches(prev => ({ ...prev, [cardId]: { ...prev[cardId], [key]: !prev[cardId][key] } }))
    toast.success('Feature updated for card')
  }

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 animate-fade-in" id="cards-page">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Cards</h2>
          <p className="text-sm text-muted-foreground">Swipe through cards, adjust limits, and manage settings</p>
        </div>
        <Button onClick={() => setApplyCardOpen(true)} id="btn-apply-card">
          <CreditCard className="h-4 w-4 mr-2" />Apply for New Card
        </Button>
      </div>

      {/* ── Card Carousel ───────────────────────────────────────────────── */}
      <div id="cards-carousel-section">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Your Cards</h3>
        <Carousel className="w-full" id="cards-carousel" opts={{ align: 'start' }}>
          <CarouselContent className="-ml-4">
            {cards.map(card => {
              const isFrozen = cardStates[card.id]
              const usePct   = Math.round((card.used / card.limit) * 100)
              return (
                <CarouselItem key={card.id} id={`carousel-card-${card.id}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border shadow-md hover:shadow-xl transition-shadow">

                    {/* Visual card face */}
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

                    {/* Action buttons */}
                    <CardContent className="p-4 space-y-3">

                      {/* Row 1: Freeze + Settings */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={isFrozen ? 'default' : 'outline'} size="sm" className="flex-1"
                          onClick={() => toggleFreeze(card.id)} id={`btn-freeze-${card.id}`}
                        >
                          {isFrozen ? <Unlock className="h-3.5 w-3.5 mr-1" /> : <Snowflake className="h-3.5 w-3.5 mr-1" />}
                          {isFrozen ? 'Unfreeze' : 'Freeze'}
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-9 w-9"
                          onClick={() => setSettingsTab(String(card.id))} id={`btn-card-settings-${card.id}`}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Row 2: View PIN + View Card Details */}
                      <div className="grid grid-cols-2 gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline" size="sm" className="w-full"
                              onClick={() => setPinDialog(true)} id={`btn-view-pin-${card.id}`}
                            >
                              <Shield className="h-3.5 w-3.5 mr-1.5" />View PIN
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>OTP verification required</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline" size="sm" className="w-full"
                              onClick={() => openCardDetails(card)} id={`btn-view-card-details-${card.id}`}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />View Card
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View card number & CVV (OTP required)</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Row 3: Increase limit (credit only) */}
                      {card.type === 'Credit Card' && (
                        <Button
                          variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                          onClick={() => navigate('/credit-limit')} id={`btn-increase-limit-${card.id}`}
                        >
                          <TrendingUp className="h-3.5 w-3.5 mr-1.5" />Increase Credit Limit
                        </Button>
                      )}

                      <Separator />

                      {/* Usage bar */}
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

      {/* ── Card Settings Tabs ──────────────────────────────────────────── */}
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

                {/* Transaction Limit Sliders — state is now at component level */}
                <Card className="border shadow-sm" id={`card-limit-settings-${card.id}`}>
                  <CardHeader><CardTitle className="text-sm font-bold">Transaction Limits</CardTitle></CardHeader>
                  <CardContent className="space-y-6">

                    {/* Daily Spending Limit */}
                    <div className="space-y-2" id={`slider-daily-${card.id}`}>
                      <div className="flex justify-between text-sm">
                        <Label className="font-medium">Daily Spending Limit</Label>
                        <Badge variant="outline" className="font-mono">
                          ₹{(sliderValues[card.id]?.daily[0] ?? 0).toLocaleString('en-IN')}
                        </Badge>
                      </div>
                      <Slider
                        id={`slider-input-daily-${card.id}`}
                        min={0} max={card.limit} step={1000}
                        value={sliderValues[card.id]?.daily ?? [0]}
                        onValueChange={v => updateSlider(card.id, 'daily', v)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹0</span><span>₹{card.limit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* ATM Withdrawal Limit */}
                    <div className="space-y-2" id={`slider-atm-${card.id}`}>
                      <div className="flex justify-between text-sm">
                        <Label className="font-medium">ATM Withdrawal Limit</Label>
                        <Badge variant="outline" className="font-mono">
                          ₹{(sliderValues[card.id]?.atm[0] ?? 0).toLocaleString('en-IN')}
                        </Badge>
                      </div>
                      <Slider
                        id={`slider-input-atm-${card.id}`}
                        min={0} max={50000} step={1000}
                        value={sliderValues[card.id]?.atm ?? [0]}
                        onValueChange={v => updateSlider(card.id, 'atm', v)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹0</span><span>₹50,000</span>
                      </div>
                    </div>

                    <Button
                      className="w-full" id={`btn-save-limits-${card.id}`}
                      onClick={() => toast.success('Limits updated!')}
                    >
                      Save Limits
                    </Button>
                  </CardContent>
                </Card>

                {/* Feature Toggles */}
                <Card className="border shadow-sm" id={`card-features-${card.id}`}>
                  <CardHeader><CardTitle className="text-sm font-bold">Card Features</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'contactless', label: 'Contactless Payments', icon: Wifi,      desc: 'Tap to pay' },
                      { key: 'online',      label: 'Online Transactions',  icon: ShoppingCart, desc: 'E-commerce & apps' },
                      { key: 'intl',        label: 'International Usage',  icon: Globe,     desc: 'For overseas transactions' },
                      { key: 'atm',         label: 'ATM Withdrawals',      icon: Banknote,  desc: 'Cash withdrawal at ATMs' },
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
                          <AlertDialogDescription>
                            All transactions including pending will be stopped immediately. You can unblock it from card settings anytime.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel id={`btn-cancel-block-${card.id}`}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            id={`btn-confirm-block-${card.id}`}
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => toast.warning(`${card.name} has been blocked.`)}
                          >Block Card</AlertDialogAction>
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

      {/* ── Recent Transactions ─────────────────────────────────────────── */}
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
                    <Badge variant="outline" className={txn.type === 'Debit' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>
                      {txn.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════
          VIEW PIN DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      <Dialog open={pinDialog} onOpenChange={closePinDialog}>
        <DialogContent className="sm:max-w-sm" id="pin-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" /> View Card PIN
            </DialogTitle>
            <DialogDescription>
              {revealedPin ? 'Your PIN is shown below. Do not share it with anyone.' : 'Enter the 6-digit OTP sent to your registered mobile.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center gap-4">
            {!revealedPin ? (
              <>
                <InputOTP maxLength={6} value={pinOtp} onChange={setPinOtp} id="pin-otp-input">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">OTP sent to ••••••7890</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 bg-muted/30 rounded-xl border border-dashed w-full">
                <Shield className="h-8 w-8 text-blue-600" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Your PIN</p>
                <p className="text-5xl font-mono tracking-[0.3em] font-bold text-primary">{revealedPin}</p>
                <p className="text-[10px] text-destructive font-bold uppercase mt-1">Do not share your PIN</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {!revealedPin
              ? <Button id="btn-verify-pin-otp" onClick={handleVerifyPinOtp} disabled={pinVerifying} className="w-full">
                  {pinVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : 'Verify & Reveal PIN'}
                </Button>
              : <Button id="btn-close-pin-dialog" onClick={closePinDialog} className="w-full">Done</Button>
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════
          VIEW CARD DETAILS DIALOG (Card Number + CVV)
      ══════════════════════════════════════════════════════════════════ */}
      <Dialog open={cardDetailsOpen} onOpenChange={closeCardDetails}>
        <DialogContent className="sm:max-w-sm" id="card-details-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              View Card Details
            </DialogTitle>
            <DialogDescription>
              {revealedDetails
                ? `Showing sensitive details for ${cardDetailsTarget?.name}. Auto-hides in ${hideCountdown}s.`
                : 'Enter the 6-digit OTP to reveal your card number and CVV.'}
            </DialogDescription>
          </DialogHeader>

          {!revealedDetails ? (
            /* ── OTP step ─────────────────────────────────────────────── */
            <>
              {/* Card preview (masked) */}
              {cardDetailsTarget && (
                <div className={`rounded-xl bg-gradient-to-br ${cardDetailsTarget.color} p-4 text-white mx-auto w-full`}>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">{cardDetailsTarget.type}</p>
                  <p className="text-sm font-bold mb-3">{cardDetailsTarget.name}</p>
                  <p className="font-mono tracking-[.2em] text-sm mb-3">{cardDetailsTarget.number}</p>
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="text-white/60 text-[10px] uppercase tracking-widest">Holder</p>
                      <p className="font-semibold">{cardDetailsTarget.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-[10px] uppercase tracking-widest">Expires</p>
                      <p className="font-semibold">{cardDetailsTarget.expiry}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-3 py-2">
                <InputOTP maxLength={6} value={detailsOtp} onChange={setDetailsOtp} id="card-details-otp-input">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">OTP sent to ••••••7890</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeCardDetails} id="btn-card-details-cancel">Cancel</Button>
                <Button onClick={handleVerifyDetailsOtp} disabled={detailsVerifying} id="btn-card-details-verify" className="min-w-[140px]">
                  {detailsVerifying
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</>
                    : <><Eye className="mr-2 h-4 w-4" />Reveal Details</>}
                </Button>
              </DialogFooter>
            </>
          ) : (
            /* ── Revealed details ─────────────────────────────────────── */
            <>
              {/* Security countdown bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Auto-hiding for security
                  </span>
                  <span className="font-mono font-bold text-amber-600">{hideCountdown}s</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(hideCountdown / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 py-2" id="revealed-card-details">

                {/* Card Number */}
                <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Card Number</p>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => handleCopy('number', revealedDetails.fullNumber)}
                      id="btn-copy-card-number"
                    >
                      {copiedField === 'number'
                        ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                        : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                    </Button>
                  </div>
                  <p className="font-mono text-xl font-bold tracking-[0.15em] text-foreground" id="revealed-card-number">
                    {formatCardNumber(revealedDetails.fullNumber)}
                  </p>
                </div>

                {/* CVV + Expiry row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CVV</p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6"
                          onClick={() => setShowCvv(p => !p)} id="btn-toggle-cvv"
                        >
                          {showCvv
                            ? <EyeOff className="h-3 w-3 text-muted-foreground" />
                            : <Eye className="h-3 w-3 text-muted-foreground" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6"
                          onClick={() => handleCopy('cvv', revealedDetails.cvv)} id="btn-copy-cvv"
                        >
                          {copiedField === 'cvv'
                            ? <Check className="h-3 w-3 text-emerald-500" />
                            : <Copy className="h-3 w-3 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                    <p className="font-mono text-xl font-bold tracking-[0.15em]" id="revealed-cvv">
                      {showCvv ? revealedDetails.cvv : '•••'}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expires</p>
                    <p className="font-mono text-xl font-bold tracking-[0.15em]">{cardDetailsTarget?.expiry}</p>
                  </div>
                </div>

                {/* Holder */}
                <div className="rounded-xl border bg-muted/40 p-4 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Card Holder</p>
                  <p className="text-sm font-semibold tracking-wide">{cardDetailsTarget?.holder}</p>
                </div>

                <p className="text-[11px] text-center text-muted-foreground px-2">
                  Never share your card number or CVV with anyone, including bank staff. SecureBank will never ask for these details.
                </p>
              </div>

              <DialogFooter>
                <Button onClick={closeCardDetails} className="w-full" id="btn-close-card-details">Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════
          APPLY FOR NEW CARD DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      <Dialog open={applyCardOpen} onOpenChange={closeApplyDialog}>
        <DialogContent className="sm:max-w-md" id="apply-card-dialog">
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
                  <Input id="apply-card-income" type="number" placeholder="e.g. 600000"
                    value={cardForm.income} onChange={e => setCardForm({ ...cardForm, income: e.target.value })} />
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
                  {isApplying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : 'Submit Application'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Application Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                Your {cardForm.variant} {cardForm.type} card application has been received.
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Application ID: CARD-{Math.floor(Math.random() * 900000 + 100000)}
              </p>
              <Button id="btn-done-apply-card" onClick={closeApplyDialog} className="mt-2">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
