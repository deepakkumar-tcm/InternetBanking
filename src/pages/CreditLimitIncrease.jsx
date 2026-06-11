import { Component, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import {
  CreditCard, TrendingUp, CheckCircle2, XCircle, Clock, Shield,
  AlertTriangle, Loader2, ArrowRight, ChevronRight, Info, Lock,
  FileCheck, User, Fingerprint, BadgeCheck, Search, Home,
  RotateCcw, ArrowUpCircle, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Policy ────────────────────────────────────────────────────────────────
const MIN_CREDIT_SCORE = 750   // updated from 650 → 750 per bank policy
const MAX_UTILIZATION  = 80
const BANK_MAX_LIMIT   = 3000000

// ─── Mock customer ──────────────────────────────────────────────────────────
const CUSTOMER = {
  customerId:       'CUST-7821',
  cifNumber:        'CIF-089123',
  accountId:        'ACC-001',
  name:             'Rajesh Kumar',
  creditScore:      720,          // below 750 → triggers ineligibility screen
  utilizationRatio: 45,
  kycStatus:        'Verified',
  kycExpiry:        '2027-12-31',
  amlStatus:        'Clear',
  fraudRiskScore:   18,
  riskLevel:        'LOW',
}

// ─── Mock credit cards ──────────────────────────────────────────────────────
const CREDIT_CARDS = [
  {
    id: 1,
    name:           'SecureBank Rewards Credit',
    maskedNumber:   '**** **** **** 8765',
    lastFour:       '8765',
    holder:         'RAJESH KUMAR',
    expiry:         '12/27',
    demoCvv:        '123',
    brand:          'Mastercard',
    cardStatus:     'Active',
    accountStatus:  'Active',
    limit:          500000,
    used:           125000,
    maxAllowed:     3000000,
    color:          'from-blue-700 to-indigo-800',
  },
  {
    id: 2,
    name:           'SecureBank Business Credit',
    maskedNumber:   '**** **** **** 3456',
    lastFour:       '3456',
    holder:         'RAJESH KUMAR',
    expiry:         '06/29',
    demoCvv:        '456',
    brand:          'Visa',
    cardStatus:     'Suspended',
    accountStatus:  'Active',
    limit:          1000000,
    used:           230000,
    maxAllowed:     3000000,
    color:          'from-violet-700 to-purple-800',
  },
]

// ─── Initial history ────────────────────────────────────────────────────────
const INITIAL_REQUESTS = [
  {
    id: 'CLR-2025-001', cardMasked: '**** **** **** 8765', cardName: 'SecureBank Rewards Credit',
    currentLimit: 300000, increaseAmount: 200000, newLimit: 500000,
    creditScore: 700, utilizationRatio: 38, kycStatus: 'Verified', fraudRiskScore: 12,
    status: 'Approved', requestDate: '2025-12-15T10:30:45Z', approvalDate: '2025-12-16T14:05:12Z', rejectionReason: null,
  },
  {
    id: 'CLR-2026-001', cardMasked: '**** **** **** 8765', cardName: 'SecureBank Rewards Credit',
    currentLimit: 500000, increaseAmount: 2500000, newLimit: 3000000,
    creditScore: 720, utilizationRatio: 45, kycStatus: 'Verified', fraudRiskScore: 8,
    status: 'Rejected', requestDate: '2026-03-20T09:15:33Z', approvalDate: null,
    rejectionReason: 'Requested credit limit exceeds the allowable maximum of ₹30,00,000',
  },
]

// ─── Compliance checks (run after eligibility gate passes) ─────────────────
const CHECKS = [
  { id: 'card_account', icon: CreditCard,  label: 'Account & Card Status',    desc: 'Confirming active status on account and card' },
  { id: 'utilization',  icon: FileCheck,   label: 'Credit Utilization Check', desc: 'Maximum allowed utilization: 80%' },
  { id: 'kyc',          icon: BadgeCheck,  label: 'KYC Status Verification',  desc: 'Identity documents & expiry check' },
  { id: 'fraud',        icon: Fingerprint, label: 'Fraud Risk Assessment',    desc: 'Device fingerprint, geolocation & velocity' },
  { id: 'aml',          icon: Search,      label: 'AML & Sanctions Screening',desc: 'Anti-money laundering & watchlist check' },
  { id: 'pci_sox',      icon: Lock,        label: 'PCI DSS / SOX Compliance', desc: 'Data masking, encryption & audit trail' },
]

function evaluateCheck(checkId, card) {
  switch (checkId) {
    case 'card_account':
      if (card.accountStatus !== 'Active')
        return { status: 'fail', message: `Account status: ${card.accountStatus}. Not eligible.` }
      if (card.cardStatus !== 'Active')
        return { status: 'fail', message: `Card status: ${card.cardStatus}. Not eligible.` }
      return { status: 'pass', message: 'Account: Active · Card: Active' }
    case 'utilization':
      if (CUSTOMER.utilizationRatio > MAX_UTILIZATION)
        return { status: 'fail', message: `Utilization: ${CUSTOMER.utilizationRatio}% exceeds ${MAX_UTILIZATION}% limit.` }
      return { status: 'pass', message: `Utilization: ${CUSTOMER.utilizationRatio}% — Within limit` }
    case 'kyc':
      if (CUSTOMER.kycStatus !== 'Verified')
        return { status: 'fail', message: 'KYC verification must be completed first.' }
      return { status: 'pass', message: `KYC: ${CUSTOMER.kycStatus} · Expires: ${CUSTOMER.kycExpiry}` }
    case 'fraud':
      if (CUSTOMER.riskLevel === 'HIGH')
        return { status: 'fail', message: 'Request blocked due to security concerns.' }
      if (CUSTOMER.riskLevel === 'MEDIUM')
        return { status: 'warn', message: 'Additional OTP verification required.' }
      return { status: 'pass', message: `Risk score: ${CUSTOMER.fraudRiskScore}/100 — LOW` }
    case 'aml':
      if (CUSTOMER.amlStatus !== 'Clear')
        return { status: 'fail', message: 'AML check failed. Request blocked.' }
      return { status: 'pass', message: 'AML: Clear · No sanctions match' }
    case 'pci_sox':
      return { status: 'pass', message: 'Card data masked · TLS 1.3 · Audit trail created' }
    default:
      return { status: 'pass', message: 'Check passed' }
  }
}

function genRequestId() {
  return `CLR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000 + 1000))}`
}
function genSRN() {
  return `SR${Date.now().toString().slice(-9)}`
}

const STATUS_BADGE = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  Pending:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
  Rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300',
}

// ─── Credit score badge (CSS only — no SVG math) ──────────────────────────
function ScoreBadge({ score }) {
  const pct = Math.round(((score - 300) / 600) * 100)
  const color =
    score >= 800 ? 'text-emerald-300' :
    score >= 750 ? 'text-green-300' :
    score >= 700 ? 'text-yellow-300' :
    score >= 650 ? 'text-orange-300' : 'text-red-300'
  const label =
    score >= 800 ? 'Excellent' :
    score >= 750 ? 'Good' :
    score >= 700 ? 'Fair' :
    score >= 650 ? 'Below Avg' : 'Poor'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center h-16 w-16 rounded-full border-4 border-white/20 bg-white/10">
        <span className={`text-xl font-black ${color}`}>{score}</span>
      </div>
      <span className={`text-xs font-bold ${color}`}>{label}</span>
      <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full rounded-full bg-white/70" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

// ─── Safe number formatter (guards against undefined.toLocaleString) ──────
const fmt = (n) => (typeof n === 'number' && isFinite(n) ? n : 0).toLocaleString('en-IN')

// ─── Error boundary ────────────────────────────────────────────────────────
class CLIErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center space-y-3">
          <p className="text-lg font-bold text-destructive">Something went wrong</p>
          <p className="text-sm text-muted-foreground font-mono">{this.state.error.message}</p>
          <button className="text-xs text-blue-600 underline" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}

// ══════════════════════════════════════════════════════════════════════════════
function CreditLimitIncreaseInner() {
  const navigate = useNavigate()
  const [requests, setRequests]     = useState(INITIAL_REQUESTS)
  const [dialogOpen, setDialogOpen] = useState(false)
  // steps: 1=card select, 2=limit slider, 3=checks, 4=otp, 5=success, 'ineligible'
  const [step, setStep]             = useState(1)

  // Step 1
  const [selectedCardId, setSelectedCardId] = useState('')

  // Step 2 — desired total limit (slider value)
  const [desiredLimit, setDesiredLimit]   = useState(0)
  const [limitInput, setLimitInput]       = useState('')
  const [limitError, setLimitError]       = useState('')

  // Step 3 — compliance
  const [processingIndex, setProcessingIndex] = useState(-1)
  const [checkResults, setCheckResults]       = useState({})
  const [processingDone, setProcessingDone]   = useState(false)
  const [overallResult, setOverallResult]     = useState(null)
  const [failReason, setFailReason]           = useState('')

  // Step 4 — OTP
  const [otp, setOtp]                   = useState('')
  const [otpVerifying, setOtpVerifying] = useState(false)

  // Result
  const [submittedReq, setSubmittedReq] = useState(null)
  const [srnNumber, setSrnNumber]       = useState('')

  const selectedCard = CREDIT_CARDS.find(c => c.id === Number(selectedCardId))

  const openDialog = () => { resetWizard(); setDialogOpen(true) }
  const closeDialog = () => {
    setDialogOpen(false)
    setTimeout(resetWizard, 300)
  }

  const resetWizard = () => {
    setStep(1); setSelectedCardId('')
    setDesiredLimit(0); setLimitInput(''); setLimitError('')
    setProcessingIndex(-1); setCheckResults({})
    setProcessingDone(false); setOverallResult(null); setFailReason('')
    setOtp(''); setOtpVerifying(false); setSubmittedReq(null); setSrnNumber('')
  }

  // ── Step 1 → Step 2 ────────────────────────────────────────────────────────
  const handleProceedCard = () => {
    if (!selectedCardId) { toast.error('Please select a credit card.'); return }
    // Set desiredLimit in the same event so Step 2 renders with a valid slider value
    const card = CREDIT_CARDS.find(c => c.id === Number(selectedCardId))
    if (card) {
      setDesiredLimit(card.limit)
      setLimitInput(fmt(card.limit))
    }
    setStep(2)
  }

  // ── Step 2 → eligibility check → Step 3 ────────────────────────────────────
  const handleProceedLimit = () => {
    if (!desiredLimit || desiredLimit <= (selectedCard?.limit ?? 0)) {
      setLimitError('Please select a limit higher than your current limit.')
      return
    }
    if (desiredLimit > BANK_MAX_LIMIT) {
      setLimitError(`Maximum allowed limit is ${formatCurrency(BANK_MAX_LIMIT)}.`)
      return
    }
    setLimitError('')

    // ── Eligibility gate: credit score must be ≥ 750 ──
    if (CUSTOMER.creditScore < MIN_CREDIT_SCORE) {
      const srn = genSRN()
      setSrnNumber(srn)
      setStep('ineligible')
      return
    }

    // Eligible — run compliance checks
    const card = selectedCard
    setStep(3)
    setTimeout(() => runChecks(card), 120)
  }

  const handleResetLimit = () => {
    if (selectedCard) {
      setDesiredLimit(selectedCard.limit)
      setLimitInput(fmt(selectedCard.limit))
      setLimitError('')
    }
  }

  const handleSliderChange = (val) => {
    setDesiredLimit(val[0])
    setLimitInput(fmt(val[0]))
    setLimitError('')
  }

  const handleLimitInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    const num = raw ? parseInt(raw, 10) : NaN
    // Keep display text exactly as typed; only update slider state if it's a valid number
    setLimitInput(raw)
    if (!isNaN(num) && selectedCard) {
      const clamped = Math.min(Math.max(num, selectedCard.limit), selectedCard.maxAllowed)
      setDesiredLimit(clamped)
    }
    setLimitError('')
  }

  // ── Step 3 – compliance async simulation ────────────────────────────────────
  const runChecks = async (card) => {
    const results = {}
    for (let i = 0; i < CHECKS.length; i++) {
      setProcessingIndex(i)
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400))
      const result = evaluateCheck(CHECKS[i].id, card)
      results[CHECKS[i].id] = result
      setCheckResults(prev => ({ ...prev, [CHECKS[i].id]: result }))
      if (result.status === 'fail') {
        setProcessingDone(true); setOverallResult('fail'); setFailReason(result.message)
        return
      }
    }
    setProcessingIndex(CHECKS.length)
    setProcessingDone(true)
    const hasWarn = Object.values(results).some(r => r.status === 'warn')
    setOverallResult(hasWarn ? 'otp_required' : 'pass')
  }

  const handleNextFromProcessing = () => {
    if (overallResult === 'pass')             finalizeRequest()
    else if (overallResult === 'otp_required') setStep(4)
    else                                       setStep(5)
  }

  // ── Step 4 ──────────────────────────────────────────────────────────────────
  const handleVerifyOtp = () => {
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP.'); return }
    setOtpVerifying(true)
    setTimeout(() => { setOtpVerifying(false); finalizeRequest() }, 1500)
  }

  // ── Finalize ─────────────────────────────────────────────────────────────────
  const finalizeRequest = () => {
    const increaseAmt = desiredLimit - selectedCard.limit
    const newReq = {
      id:               genRequestId(),
      cardMasked:       selectedCard.maskedNumber,
      cardName:         selectedCard.name,
      currentLimit:     selectedCard.limit,
      increaseAmount:   increaseAmt,
      newLimit:         desiredLimit,
      creditScore:      CUSTOMER.creditScore,
      utilizationRatio: CUSTOMER.utilizationRatio,
      kycStatus:        CUSTOMER.kycStatus,
      fraudRiskScore:   CUSTOMER.fraudRiskScore,
      status:           'Pending',
      requestDate:      new Date().toISOString(),
      approvalDate:     null,
      rejectionReason:  null,
    }
    setSubmittedReq(newReq)
    setRequests(prev => [newReq, ...prev])
    const stored = JSON.parse(localStorage.getItem('clr_pending_requests') || '[]')
    localStorage.setItem('clr_pending_requests', JSON.stringify([newReq, ...stored]))
    setStep(5)
    toast.success(`Request ${newReq.id} submitted successfully.`)
  }

  const approved = requests.filter(r => r.status === 'Approved').length
  const pending  = requests.filter(r => r.status === 'Pending').length
  const rejected = requests.filter(r => r.status === 'Rejected').length
  const progressPct = processingIndex < 0
    ? 0 : Math.round((Math.min(processingIndex + 1, CHECKS.length) / CHECKS.length) * 100)

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 animate-fade-in" id="credit-limit-page">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <CreditCard className="h-3.5 w-3.5" />
        <span>Cards</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">Credit Limit Increase</span>
      </div>

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Exclusive Offer</span>
            </div>
            <h2 className="text-3xl font-black leading-tight">
              Enjoy shopping with a<br />higher Credit Limit
            </h2>
            <p className="text-blue-200 text-sm max-w-md">
              Get instant access to more spending power. Apply now and get a decision within minutes.
            </p>
            <Button
              onClick={openDialog}
              id="btn-new-request"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg mt-2"
            >
              <TrendingUp className="h-4 w-4 mr-2" />Apply for Limit Increase
            </Button>
          </div>

          {/* Score meter + stats */}
          <div className="flex flex-col items-center gap-1 bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20 min-w-[160px]">
            <ScoreBadge score={CUSTOMER.creditScore} />
            <p className="text-xs text-blue-200 font-semibold mt-1">Your Credit Score</p>
            <div className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
              CUSTOMER.creditScore >= MIN_CREDIT_SCORE
                ? 'bg-emerald-500/30 text-emerald-200'
                : 'bg-red-500/30 text-red-200'
            }`}>
              {CUSTOMER.creditScore >= MIN_CREDIT_SCORE ? 'Eligible' : `Min required: ${MIN_CREDIT_SCORE}`}
            </div>
          </div>
        </div>
      </div>

      {/* ── Benefits cards (like the SBI app Benefits screen) ─────────────── */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Card Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Avail New Card',
              desc:  'Choose additional cards to get more benefits',
              color: 'from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40',
              border: 'border-blue-100 dark:border-blue-900',
              icon: CreditCard,
              iconBg: 'bg-blue-100 dark:bg-blue-900',
              iconColor: 'text-blue-600 dark:text-blue-400',
              action: () => navigate('/cards'),
            },
            {
              title: 'Credit Limit Increase',
              desc:  'Exclusive offer! Increase your Credit Limit now',
              color: 'from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40',
              border: 'border-pink-100 dark:border-pink-900',
              icon: TrendingUp,
              iconBg: 'bg-pink-100 dark:bg-pink-900',
              iconColor: 'text-pink-600 dark:text-pink-400',
              action: openDialog,
              highlight: true,
            },
            {
              title: 'Card Protection Plan',
              desc:  'Enjoy exclusive benefits with CPP Card protection plan',
              color: 'from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40',
              border: 'border-purple-100 dark:border-purple-900',
              icon: Shield,
              iconBg: 'bg-purple-100 dark:bg-purple-900',
              iconColor: 'text-purple-600 dark:text-purple-400',
              action: () => toast.info('Card Protection Plan — Coming soon'),
            },
          ].map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              className={`relative text-left rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} p-5 flex items-center gap-4 hover:shadow-md transition-all group`}
            >
              <div className={`h-14 w-14 rounded-2xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`h-7 w-7 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform`}>
                <ArrowRight className={`h-4 w-4 ${item.iconColor}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: requests.length, icon: FileCheck,    color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950' },
          { label: 'Approved',       value: approved,        icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
          { label: 'Pending Review', value: pending,         icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950' },
          { label: 'Rejected',       value: rejected,        icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-950' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Policy note ───────────────────────────────────────────────────── */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Bank Policy —</strong>&nbsp;
          Credit Limit Increase is subject to internal assessment policies and is at the absolute discretion of SecureBank.
          Minimum credit score required: <strong>{MIN_CREDIT_SCORE}</strong>. Your score: <strong className={CUSTOMER.creditScore >= MIN_CREDIT_SCORE ? 'text-emerald-600' : 'text-red-600'}>{CUSTOMER.creditScore}</strong>.
        </AlertDescription>
      </Alert>

      {/* ── Request History ───────────────────────────────────────────────── */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold">Request History</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">All credit limit increase requests for your account</p>
          </div>
          <Badge variant="outline">{requests.length} request{requests.length !== 1 ? 's' : ''}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No requests yet. Click <strong>Apply for Limit Increase</strong> to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-6 text-xs uppercase tracking-wider font-bold">Request ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold">Card</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">Current Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">New Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-center">Score</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-center pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-mono text-xs font-bold text-primary">{req.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-[160px]">{req.cardName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{req.cardMasked}</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatCurrency(req.currentLimit)}</TableCell>
                    <TableCell className="text-right font-bold text-sm text-emerald-600">{formatCurrency(req.newLimit)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs font-bold ${req.creditScore >= MIN_CREDIT_SCORE ? 'text-emerald-600' : 'text-red-500'}`}>{req.creditScore}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(req.requestDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Badge variant="outline" className={STATUS_BADGE[req.status] || ''}>{req.status}</Badge>
                      {req.rejectionReason && (
                        <p className="text-[10px] text-red-500 mt-0.5 max-w-[160px] text-left leading-tight">{req.rejectionReason}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          WIZARD DIALOG
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent
          className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-0"
          onPointerDownOutside={e => { if (step === 3 && !processingDone) e.preventDefault() }}
        >

          {/* ── STEP 1: Select card ─────────────────────────────────────── */}
          {step === 1 && (
            <>
              {/* Mini hero */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-t-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <ArrowUpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">Credit Limit Increase</p>
                    <p className="text-blue-200 text-xs mt-0.5">Select the card you want to upgrade</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Min Score Required', value: MIN_CREDIT_SCORE },
                    { label: 'Your Score', value: CUSTOMER.creditScore, highlight: true },
                    { label: 'Max Limit', value: '₹30L' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-xl py-2 px-1">
                      <p className={`text-base font-black ${s.highlight ? (CUSTOMER.creditScore >= MIN_CREDIT_SCORE ? 'text-emerald-300' : 'text-red-300') : 'text-white'}`}>{s.value}</p>
                      <p className="text-[10px] text-blue-200 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Select Credit Card</Label>
                  <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                    <SelectTrigger id="sel-card"><SelectValue placeholder="Choose a card to upgrade" /></SelectTrigger>
                    <SelectContent>
                      {CREDIT_CARDS.map(c => (
                        <SelectItem key={c.id} value={String(c.id)} id={`sel-card-${c.id}`}>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{c.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">{c.maskedNumber}</span>
                            {c.cardStatus !== 'Active' && (
                              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200">{c.cardStatus}</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected card preview */}
                {selectedCard && (
                  <div className={`rounded-xl bg-gradient-to-br ${selectedCard.color} p-4 text-white`}>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">{selectedCard.brand}</p>
                    <p className="font-bold text-sm mt-0.5 mb-3">{selectedCard.name}</p>
                    <p className="font-mono tracking-[.2em] text-sm mb-3">{selectedCard.maskedNumber}</p>
                    <div className="flex justify-between text-xs">
                      <div>
                        <p className="text-white/60 text-[10px] uppercase tracking-widest">Current Limit</p>
                        <p className="font-bold text-base mt-0.5">₹{fmt(selectedCard.limit)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest">Available</p>
                        <p className="font-bold mt-0.5">₹{fmt(selectedCard.limit - selectedCard.used)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest">Expires</p>
                        <p className="font-bold mt-0.5">{selectedCard.expiry}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={closeDialog} className="flex-1">Cancel</Button>
                  <Button onClick={handleProceedCard} className="flex-1" id="btn-s1-proceed">
                    Proceed <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Desired limit slider ────────────────────────────── */}
          {step === 2 && selectedCard && (
            <>
              {/* Header banner */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-t-lg p-6 border-b">
                <div className="flex items-center justify-between mb-3">
                  <div className="rounded-lg bg-white dark:bg-gray-900 border px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Current Card</p>
                    <p className="text-sm font-black">{selectedCard.name.replace('SecureBank ', '')}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-900 border px-3 py-2 text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Current Credit Limit</p>
                    <p className="text-sm font-black text-blue-600">₹{fmt(selectedCard.limit)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">Please select your desired Credit Limit</p>
                  <p className="text-4xl font-black text-foreground tracking-tight">
                    ₹{fmt(desiredLimit)}
                  </p>
                  {desiredLimit > selectedCard.limit && (
                    <p className="text-xs font-semibold text-emerald-600">
                      +₹{fmt(desiredLimit - selectedCard.limit)} increase
                    </p>
                  )}
                </div>

                {/* Slider */}
                <div className="space-y-3">
                  <Slider
                    min={selectedCard.limit}
                    max={selectedCard.maxAllowed}
                    step={10000}
                    value={[Math.min(Math.max(desiredLimit, selectedCard.limit), selectedCard.maxAllowed)]}
                    onValueChange={handleSliderChange}
                    className="w-full"
                    id="limit-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>Current ₹{fmt(selectedCard.limit)}</span>
                    <span>Max ₹{fmt(selectedCard.maxAllowed)}</span>
                  </div>
                </div>

                {/* Manual input */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-widest">Enter Desired Limit</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">₹</span>
                    <Input
                      id="limit-input"
                      className={`pl-7 text-sm font-semibold ${limitError ? 'border-red-500' : ''}`}
                      value={limitInput}
                      onChange={handleLimitInputChange}
                      placeholder="e.g. 7,00,000"
                    />
                  </div>
                  {limitError && <p className="text-xs text-red-500">{limitError}</p>}
                </div>

                {/* Policy disclaimer */}
                <div className="rounded-xl bg-muted/50 border p-3 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Credit Limit Increase is subject to SecureBank internal policies and at the absolute discretion of SecureBank.
                    Minimum credit score required is <strong>{MIN_CREDIT_SCORE}</strong>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleResetLimit} id="btn-reset" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />Reset
                  </Button>
                  <Button onClick={handleProceedLimit} id="btn-proceed" className="flex-1">
                    Proceed <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── INELIGIBLE screen ───────────────────────────────────────── */}
          {step === 'ineligible' && (
            <div className="p-8 text-center space-y-5" id="ineligible-screen">
              <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto shadow-lg">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black">Sorry!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Basis our internal assessment, you are currently not eligible for a Credit Limit Increase.
                </p>
                <p className="text-sm text-muted-foreground">We regret the inconvenience caused.</p>
              </div>

              {/* Score comparison */}
              <div className="rounded-xl bg-muted/50 border p-4 text-sm space-y-2 text-left max-w-xs mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Credit Score</span>
                  <span className="font-bold text-red-600">{CUSTOMER.creditScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Minimum Required</span>
                  <span className="font-bold text-foreground">{MIN_CREDIT_SCORE}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">Shortfall</span>
                  <span className="text-xs font-bold text-amber-600">{MIN_CREDIT_SCORE - CUSTOMER.creditScore} points</span>
                </div>
              </div>

              {/* Service request number */}
              <div className="border rounded-xl p-4 bg-background max-w-xs mx-auto">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Service Request Number</p>
                <p className="font-mono text-sm font-bold text-primary">{srnNumber}</p>
              </div>

              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Please refer to this service request number for any queries. You may reapply once your credit score improves.
              </p>

              <Button
                id="btn-go-home"
                onClick={() => { closeDialog(); navigate('/dashboard') }}
                className="w-full max-w-xs mx-auto flex gap-2"
              >
                <Home className="h-4 w-4" />Go to Home
              </Button>
            </div>
          )}

          {/* ── STEP 3: Compliance checks ───────────────────────────────── */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {!processingDone
                    ? 'Processing your request…'
                    : overallResult === 'fail'         ? 'Request Could Not Be Processed'
                    : overallResult === 'otp_required' ? 'Verification Required'
                    :                                    'All Checks Passed ✓'}
                </DialogTitle>
                <DialogDescription>
                  {!processingDone ? 'Please wait while we verify your eligibility.' : ''}
                </DialogDescription>
              </DialogHeader>

              <Progress value={progressPct} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{progressPct}% complete</p>

              <div className="space-y-1.5">
                {CHECKS.map((check, i) => {
                  const result   = checkResults[check.id]
                  const isActive = processingIndex === i && !result
                  const Icon     = check.icon
                  let statusIcon = <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/25" />
                  if (isActive)                    statusIcon = <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  else if (result?.status === 'pass') statusIcon = <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  else if (result?.status === 'warn') statusIcon = <AlertTriangle className="h-4 w-4 text-amber-500" />
                  else if (result?.status === 'fail') statusIcon = <XCircle className="h-4 w-4 text-red-500" />
                  return (
                    <div key={check.id}
                      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors
                        ${isActive             ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                        : result?.status==='fail' ? 'bg-red-50 dark:bg-red-950/30 border border-red-200'
                        : result?.status==='warn' ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200'
                        : result?.status==='pass' ? 'bg-muted/30' : ''}`}>
                      <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className={`h-3.5 w-3.5 ${
                          isActive ? 'text-blue-500'
                          : result?.status==='pass' ? 'text-emerald-500'
                          : result?.status==='warn' ? 'text-amber-500'
                          : result?.status==='fail' ? 'text-red-500'
                          : 'text-muted-foreground/40'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-none mb-0.5
                          ${result?.status==='fail' ? 'text-red-600' : result?.status==='warn' ? 'text-amber-700' : 'text-foreground'}`}>
                          {check.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result ? result.message : isActive ? 'Checking…' : check.desc}
                        </p>
                      </div>
                      <div className="flex-shrink-0 mt-0.5">{statusIcon}</div>
                    </div>
                  )
                })}
              </div>

              {processingDone && (
                <div className="pt-2">
                  {overallResult === 'fail'
                    ? <Button variant="outline" onClick={closeDialog} className="w-full">Close</Button>
                    : <Button onClick={handleNextFromProcessing} className={`w-full ${overallResult === 'pass' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
                        {overallResult === 'otp_required'
                          ? <>Verify OTP <ArrowRight className="h-4 w-4 ml-2" /></>
                          : <>Confirm Request <ArrowRight className="h-4 w-4 ml-2" /></>}
                      </Button>
                  }
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: OTP ─────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="p-6 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">OTP Verification</DialogTitle>
                <DialogDescription>
                  Additional verification required. Enter the 6-digit OTP sent to ••••7890.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-amber-600" />
                </div>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} id="otp-input">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">Enter any 6 digits for this demo</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">← Back</Button>
                <Button onClick={handleVerifyOtp} disabled={otpVerifying} className="flex-1" id="btn-verify-otp">
                  {otpVerifying
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying…</>
                    : <>Verify & Submit <ArrowRight className="h-4 w-4 ml-2" /></>}
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Success ─────────────────────────────────────────── */}
          {step === 5 && (
            <div className="p-8 text-center space-y-5" id="success-screen">
              <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Request Submitted!</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Your credit limit increase request is under review. You will be notified within 2–3 business days.
                </p>
              </div>

              {submittedReq && (
                <div className="rounded-xl bg-muted/50 border p-4 text-sm text-left space-y-2.5 max-w-xs mx-auto">
                  {[
                    ['Request ID',       <span className="font-mono font-bold text-primary">{submittedReq.id}</span>],
                    ['Card',             <span className="font-mono text-xs">{submittedReq.cardMasked}</span>],
                    ['Current Limit',    <span className="font-semibold">{formatCurrency(submittedReq.currentLimit)}</span>],
                    ['Requested Limit',  <span className="font-bold text-emerald-600">{formatCurrency(submittedReq.newLimit)}</span>],
                    ['Increase Amount',  <span className="font-bold text-blue-600">+{formatCurrency(submittedReq.increaseAmount)}</span>],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{k}</span>{v}
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={STATUS_BADGE['Pending']}>Pending Review</Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-3 max-w-xs mx-auto w-full">
                <Button variant="outline" onClick={closeDialog} className="flex-1" id="btn-done">Done</Button>
                <Button
                  onClick={() => { closeDialog(); navigate('/dashboard') }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  id="btn-go-home-success"
                >
                  <Home className="h-4 w-4 mr-2" />Go to Home
                </Button>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CreditLimitIncrease() {
  return (
    <CLIErrorBoundary>
      <CreditLimitIncreaseInner />
    </CLIErrorBoundary>
  )
}
